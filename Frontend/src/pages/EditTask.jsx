import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import "../css/EditTask.css";

function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    code: "",
    description: "",
    due_date: "",
    priority: "Medium",
    status: "Pending",
  });

  const [attachment, setAttachment] = useState(null);

  const getTask = async () => {
    try {
      const response = await api.get(`tasks/${id}/`);

      setForm({
        name: response.data.name,
        code: response.data.code,
        description: response.data.description,
        due_date: response.data.due_date,
        priority: response.data.priority,
        status: response.data.status,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTask();
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    data.append("name", form.name);
    data.append("code", form.code);
    data.append("description", form.description);
    data.append("due_date", form.due_date);
    data.append("priority", form.priority);
    data.append("status", form.status);

    if (attachment) {
      data.append("attachment", attachment);
    }

    try {
      await api.patch(`tasks/${id}/`, data);

      alert("Task updated successfully");
      navigate(`/tasks/${id}`);
    } catch (error) {
      console.log(error.response?.data);
      alert("Task update nahi hua");
    }
  };

  return (
    <div className="edit-task-page">

      <div className="edit-task-container">

        <div className="edit-task-top">
          <button
            className="edit-back-btn"
            onClick={() => navigate(`/tasks/${id}`)}
          >
            ← Back to Task
          </button>
        </div>


        <div className="edit-task-card">

          <div className="edit-task-header">
            <h1>Edit Task</h1>

            <p>
              Update task information and settings
            </p>
          </div>


          <form
            className="edit-task-form"
            onSubmit={handleSubmit}
          >

            <div className="edit-form-group">
              <label>Task Name</label>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Task name"
                required
              />
            </div>


            <div className="edit-form-group">
              <label>Task Code</label>

              <input
                name="code"
                value={form.code}
                onChange={handleChange}
                placeholder="Task code"
                required
              />
            </div>


            <div className="edit-form-group">
              <label>Description</label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Description"
                required
              />
            </div>


            <div className="edit-form-group">
              <label>Due Date</label>

              <input
                type="date"
                name="due_date"
                value={form.due_date}
                onChange={handleChange}
                required
              />
            </div>


            <div className="edit-form-row">

              <div className="edit-form-group">
                <label>Priority</label>

                <select
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                >
                  <option value="Low">
                    Low
                  </option>

                  <option value="Medium">
                    Medium
                  </option>

                  <option value="High">
                    High
                  </option>
                </select>
              </div>


              <div className="edit-form-group">
                <label>Status</label>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="Pending">
                    Pending
                  </option>

                  <option value="In Progress">
                    In Progress
                  </option>

                  <option value="Completed">
                    Completed
                  </option>
                </select>
              </div>

            </div>


            <div className="edit-form-group">
              <label>Change Attachment</label>

              <div className="edit-file-box">

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setAttachment(
                      e.target.files[0]
                    )
                  }
                />

                <p>
                  Select a new image only if you
                  want to replace the current attachment.
                </p>

                {attachment && (
                  <span className="edit-selected-file">
                    Selected: {attachment.name}
                  </span>
                )}

              </div>
            </div>


            <div className="edit-form-actions">

              <button
                type="button"
                className="edit-cancel-btn"
                onClick={() =>
                  navigate(`/tasks/${id}`)
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                className="edit-submit-btn"
              >
                Update Task
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}

export default EditTask;