import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../css/Createtask.css";

function CreateTask() {
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
      await api.post("tasks/", data);

      alert("Task created successfully");
      navigate("/dashboard");
    } catch (error) {
      console.log(error.response?.data);
      alert("Task create nahi hua");
    }
  };

  return (
    <div className="create-task-page">

      <div className="create-task-container">

        <div className="create-task-top">
          <button
            className="create-back-btn"
            onClick={() => navigate("/dashboard")}
          >
            ← Back to Dashboard
          </button>
        </div>


        <div className="create-task-card">

          <div className="create-task-header">
            <h1>Create Task</h1>

            <p>
              Add a new task to the task board
            </p>
          </div>


          <form
            className="create-task-form"
            onSubmit={handleSubmit}
          >

            <div className="create-form-group">
              <label>Task Name</label>

              <input
                name="name"
                placeholder="Enter task name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>


            <div className="create-form-group">
              <label>Task Code</label>

              <input
                name="code"
                placeholder="Enter unique task code"
                value={form.code}
                onChange={handleChange}
                required
              />
            </div>


            <div className="create-form-group">
              <label>Description</label>

              <textarea
                name="description"
                placeholder="Enter task description"
                value={form.description}
                onChange={handleChange}
                required
              />
            </div>


            <div className="create-form-group">
              <label>Due Date</label>

              <input
                type="date"
                name="due_date"
                value={form.due_date}
                onChange={handleChange}
                required
              />
            </div>


            <div className="create-form-row">

              <div className="create-form-group">
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


              <div className="create-form-group">
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


            <div className="create-form-group">
              <label>Attachment</label>

              <div className="create-file-box">
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
                  Upload an image for this task
                </p>

                {attachment && (
                  <span className="selected-file">
                    Selected: {attachment.name}
                  </span>
                )}
              </div>
            </div>


            <div className="create-form-actions">

              <button
                type="button"
                className="create-cancel-btn"
                onClick={() =>
                  navigate("/dashboard")
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                className="create-submit-btn"
              >
                Create Task
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}

export default CreateTask;