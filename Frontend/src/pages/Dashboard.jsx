import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable,} from "@hello-pangea/dnd";
import api from "../api/axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../css/Dashboard.css"

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [ordering, setOrdering] = useState(""); 
  const [user, setUser] = useState(null); 
  const [page, setPage] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const navigate = useNavigate();
 const getTasks = async () => {
  try {
    setLoading(true);

    const params = {
      page: page,
    };

    if (search) {
      params.search = search;
    }

    if (statusFilter) {
      params.status = statusFilter;
    }

    if (priorityFilter) {
      params.priority = priorityFilter;
    }

    if (ordering) {
      params.ordering = ordering;
    }

    const response = await api.get("tasks/", {
      params: params,
    });

    setTasks(response.data.results || []);
    setTotalTasks(response.data.count || 0);
    setHasNext(Boolean(response.data.next));
    setHasPrevious(Boolean(response.data.previous));

  } catch (error) {
    console.log("Task fetch error:", error);
  } finally {
    setLoading(false);
  }
};
const handleFilter = (e) => {
  e.preventDefault();
  getTasks();
};
const getCurrentUser = async () => {
  try {
    const response = await api.get("account/me/");
    setUser(response.data);
  } catch (error) {
    console.log(error);
  }
};
  useEffect(() => {
     getTasks();
  },  [statusFilter, priorityFilter, ordering, page]);
  useEffect(() => {
  getCurrentUser();
}, []);

 const handleDragEnd = async (result) => {
  const { source, destination, draggableId } = result;

  if (!destination) {
    return;
  }

  const taskId = Number(draggableId);

  // Normal user vertical reorder nahi kar sakta
  if (
    !user?.is_staff &&
    source.droppableId === destination.droppableId
  ) {
    return;
  }

  // ADMIN: same column me vertical reorder
  if (
    user?.is_staff &&
    source.droppableId === destination.droppableId
  ) {
    const columnTasks = tasks.filter(
      (task) => task.status === source.droppableId
    );

    const movedTask = columnTasks[source.index];

    columnTasks.splice(source.index, 1);
    columnTasks.splice(destination.index, 0, movedTask);

    // Baaki columns ke tasks
    const otherTasks = tasks.filter(
      (task) => task.status !== source.droppableId
    );

    const updatedTasks = [...columnTasks, ...otherTasks];

    setTasks(updatedTasks);

    try {
      await api.patch("tasks/reorder/", {
        task_ids: updatedTasks.map((task) => task.id),
      });

      getTasks();
    } catch (error) {
      console.log(error);
      alert("Task reorder nahi hua");
      getTasks();
    }

    return;
  }

  // Horizontal movement - Admin aur User dono
  const newStatus = destination.droppableId;

  const updatedTasks = tasks.map((task) =>
    task.id === taskId
      ? { ...task, status: newStatus }
      : task
  );

  setTasks(updatedTasks);

  try {
    await api.patch(`tasks/${taskId}/status/`, {
      status: newStatus,
    });

    getTasks();
  } catch (error) {
    console.log(error);
    alert("Task status update nahi hua");
    getTasks();
  }
};

  const getTasksByStatus = (status) => {
    return tasks.filter((task) => task.status === status);
  };

  const columns = [
    "Pending", "In Progress", "Completed", ];

  if (loading) {
    return <h2>Loading tasks...</h2>;
  }
const handleLogout = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");

  navigate("/login");
};
const exportToExcel = async () => {
  try {
    const exportTasks = await getExportTasks();

    const exportData = exportTasks.map((task) => ({
      Code: task.code,
      Name: task.name,
      Description: task.description,
      "Due Date": task.due_date,
      Priority: task.priority,
      Status: task.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Tasks"
    );

    XLSX.writeFile(workbook, "tasks.xlsx");
  } catch (error) {
    console.log(error);
    alert("Excel export nahi hua");
  }
};
const exportToPDF = async () => {
  try {
    const exportTasks = await getExportTasks();

    const doc = new jsPDF();

    doc.text("Task Board Report", 14, 15);

    const tableData = exportTasks.map((task) => [
      task.code,
      task.name,
      task.due_date,
      task.priority,
      task.status,
    ]);

    autoTable(doc, {
      startY: 22,
      head: [
        [
          "Code",
          "Name",
          "Due Date",
          "Priority",
          "Status",
        ],
      ],
      body: tableData,
    });

    doc.save("tasks.pdf");
  } catch (error) {
    console.log(error);
    alert("PDF export nahi hua");
  }
};
const getExportTasks = async () => {
  const params = {};

  if (search) {
    params.search = search;
  }

  if (statusFilter) {
    params.status = statusFilter;
  }

  if (priorityFilter) {
    params.priority = priorityFilter;
  }

  if (ordering) {
    params.ordering = ordering;
  }

  const response = await api.get("tasks/export/", {
    params,
  });

  return response.data;
};
  return (
  <div className="dashboard">

    {/* HEADER */}
    <div className="dashboard-header">
      <div className="dashboard-title">
        <h1>Task Board</h1>
        <p>Manage and track your tasks</p>
      </div>

      <div className="header-actions">
        {user?.is_staff && (
          <>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/tasks/create")}
            >
              + Create Task
            </button>

            <button
              className="btn"
              onClick={exportToExcel}
            >
              Export Excel
            </button>

            <button
              className="btn"
              onClick={exportToPDF}
            >
              Export PDF
            </button>
          </>
        )}

        <button
          className="btn btn-danger"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>


    {/* SEARCH + FILTERS */}
    <form
      onSubmit={handleFilter}
      className="filters"
    >
      <input
        type="text"
        placeholder="Search name or code"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        value={statusFilter}
        onChange={(e) => {
          setStatusFilter(e.target.value);
          setPage(1);
        }}
      >
        <option value="">All Status</option>
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>

      <select
        value={priorityFilter}
        onChange={(e) => {
          setPriorityFilter(e.target.value);
          setPage(1);
        }}
      >
        <option value="">All Priority</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      <select
        value={ordering}
        onChange={(e) => {
          setOrdering(e.target.value);
          setPage(1);
        }}
      >
        <option value="">Default Order</option>

        <option value="due_date">
          Due Date: Earliest
        </option>

        <option value="-due_date">
          Due Date: Latest
        </option>
      </select>

      <button
        type="submit"
        className="btn btn-primary"
      >
        Apply
      </button>
    </form>


    {/* KANBAN BOARD */}
    <DragDropContext onDragEnd={handleDragEnd}>

      <div className="kanban-board">

        {columns.map((status) => {

          const columnTasks =
            getTasksByStatus(status);

          return (
            <Droppable
              droppableId={status}
              key={status}
            >

              {(provided) => (

                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="kanban-column"
                >

                  <div className="column-header">
                    <h2>
                      {status}
                    </h2>

                    <span className="task-count">
                      {columnTasks.length}
                    </span>
                  </div>


                  {columnTasks.map(
                    (task, index) => (

                      <Draggable
                        key={task.id}
                        draggableId={String(task.id)}
                        index={index}
                      >

                        {(provided) => (

                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}

                            onClick={() =>
                              navigate(
                                `/tasks/${task.id}`
                              )
                            }

                            className="task-card"

                            style={{
                              ...provided
                                .draggableProps
                                .style,
                            }}
                          >

                            <div className="task-card-header">

                              <h3>
                                {task.name}
                              </h3>

                              <span
                                className={`priority priority-${task.priority.toLowerCase()}`}
                              >
                                {task.priority}
                              </span>

                            </div>


                            <p className="task-code">
                              <b>Code:</b>{" "}
                              {task.code}
                            </p>


                            <p>
                              <b>Due:</b>{" "}
                              {task.due_date}
                            </p>


                            <p className="task-description">
                              {task.description}
                            </p>

                          </div>

                        )}

                      </Draggable>

                    )
                  )}


                  {provided.placeholder}

                </div>

              )}

            </Droppable>
          );

        })}

      </div>

    </DragDropContext>


    {/* PAGINATION */}
    <div className="pagination">

      <button
        className="btn"
        disabled={!hasPrevious}
        onClick={() =>
          setPage(page - 1)
        }
      >
        Previous
      </button>


      <span className="page-info">
        Page {page} | Total Tasks: {totalTasks}
      </span>


      <button
        className="btn"
        disabled={!hasNext}
        onClick={() =>
          setPage(page + 1)
        }
      >
        Next
      </button>

    </div>

  </div>
);
}

export default Dashboard;