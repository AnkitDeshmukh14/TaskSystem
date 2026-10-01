import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import "../css/Taskdetails.css";

function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [commentFile, setCommentFile] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replyFile, setReplyFile] = useState(null);
  const [commentMentionSearch, setCommentMentionSearch] = useState(null);
  const [replyMentionSearch, setReplyMentionSearch] = useState(null);
  const [user, setUser] = useState(null);
   const getUsers = async () => {
  try {
    const response = await api.get("account/users/");
    setUsers(response.data);
  } catch (error) {
    console.log(error);
  }
};
  const getTaskDetails = async () => {
    try {
      const taskResponse = await api.get(`tasks/${id}/`);

      const commentResponse = await api.get(
        `comments/?task=${id}`
      );

      setTask(taskResponse.data);
      setComments(commentResponse.data.results || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
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
    getTaskDetails();
    getCurrentUser();
    getUsers();
  }, [id]);

  const addComment = async (e) => {
    e.preventDefault();

    if (!commentText.trim() && !commentFile) {
      return;
    }

    const formData = new FormData();

    formData.append("task", id);
    formData.append("content", commentText);

    if (commentFile) {
      formData.append("attachment", commentFile);
    }

    try {
      await api.post("comments/", formData);

      setCommentText("");
      setCommentFile(null);

      getTaskDetails();
    } catch (error) {
      console.log(error);
      alert("Comment add nahi hua");
    }
  };
const addReply = async (commentId) => {
  if (!replyText.trim() && !replyFile) {
    return;
  }

  const formData = new FormData();

  formData.append("task", id);
  formData.append("content", replyText);
  formData.append("parent", commentId);

  if (replyFile) {
    formData.append("attachment", replyFile);
  }

  try {
    await api.post("comments/", formData);

    setReplyText("");
    setReplyFile(null);
    setReplyTo(null);
    setReplyMentionSearch(null);

    getTaskDetails();
  } catch (error) {
    console.log(error);
    alert("Reply add nahi hua");
  }
};

  const deleteTask = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(`tasks/${id}/`);

      alert("Task deleted successfully");
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      alert("Task delete nahi hua");
    }
  };

  if (loading) {
    return (
      <div className="task-details-message">
        <h2>Loading...</h2>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="task-details-message">
        <h2>Task not found</h2>
      </div>
    );
  }
const renderCommentText = (text) => {
  if (!text) return null;

  const parts = text.split(/(@\w+)/g);

  return parts.map((part, index) => {
    if (part.startsWith("@")) {
      return (
        <span
          key={index}
          className="mention"
        >
          {part}
        </span>
      );
    }

    return part;
  });
};
const getMentionSearch = (text) => {
  const match = text.match(/(?:^|\s)@([a-zA-Z0-9_]*)$/);

  if (!match) {
    return null;
  }

  return match[1];
};  
const getMentionedUsers = (text) => {
  const matches = text.match(/@([a-zA-Z0-9_]+)/g) || [];

  return matches.map((mention) =>
    mention.substring(1).toLowerCase()
  );
};
const getFilteredUsers = (search, text) => {
  if (search === null) {
    return [];
  }

  const mentionedUsers = getMentionedUsers(text);

  return users.filter((mentionUser) => {
    const username =
      mentionUser.username.toLowerCase();

    const matchesSearch =
      username.includes(search.toLowerCase());

    const notAlreadyMentioned =
      !mentionedUsers.includes(username);

    return matchesSearch && notAlreadyMentioned;
  });
};
  return (
    <div className="task-details-page">

      <div className="task-details-container">

        {/* BACK BUTTON */}

        <button
          className="task-back-btn"
          onClick={() => navigate("/dashboard")}
        >
          ← Back to Dashboard
        </button>


        {/* TASK DETAILS */}

        <div className="task-info-card">

          <div className="task-info-header">

            <div>
              <span className="task-code-label">
                {task.code}
              </span>

              <h1>{task.name}</h1>
            </div>


            {user?.is_staff && (
              <div className="task-admin-actions">

                <button
                  className="task-edit-btn"
                  onClick={() =>
                    navigate(`/tasks/${id}/edit`)
                  }
                >
                  Edit Task
                </button>

                <button
                  className="task-delete-btn"
                  onClick={deleteTask}
                >
                  Delete Task
                </button>

              </div>
            )}

          </div>


          <div className="task-meta">

            <div className="task-meta-item">
              <span>Status</span>

              <strong className="task-status">
                {task.status}
              </strong>
            </div>


            <div className="task-meta-item">
              <span>Priority</span>

              <strong
                className={`details-priority details-priority-${task.priority.toLowerCase()}`}
              >
                {task.priority}
              </strong>
            </div>


            <div className="task-meta-item">
              <span>Due Date</span>

              <strong>
                {task.due_date}
              </strong>
            </div>

          </div>


          <div className="task-description-section">
            <h3>Description</h3>

            <p>
              {task.description}
            </p>
          </div>


          {task.attachment && (
            <div className="task-attachment">

              <h3>Attachment</h3>

              <a
                href={task.attachment}
                target="_blank"
                rel="noreferrer"
              >
                View Task Attachment
              </a>

            </div>
          )}

        </div>


        {/* DISCUSSION */}

        <div className="comments-section">

          <div className="comments-header">
            <div>
              <h2>Discussion</h2>

              <p>
                Ask questions and collaborate on this task
              </p>
            </div>

            <span className="comments-count">
              {comments.length}
            </span>
          </div>


          {/* ADD COMMENT */}

          <form
            className="comment-form"
            onSubmit={addComment}
          >

            <div className="mention-input-wrapper">

  <textarea
    placeholder="Write your comment... Type @ to mention someone"
    value={commentText}
    onChange={(e) => {
      const value = e.target.value;

      setCommentText(value);
      setCommentMentionSearch(
        getMentionSearch(value)
      );
    }}
  />

  {commentMentionSearch !== null &&
    getFilteredUsers(
      commentMentionSearch,
      commentText
    ).length > 0 && (

      <div className="mention-suggestions">

        {getFilteredUsers(
          commentMentionSearch,
          commentText
        ).map((mentionUser) => (

          <button
            type="button"
            key={mentionUser.id}
            className="mention-suggestion-item"
            onClick={() => {

              const newText =
                commentText.replace(
                  /@([a-zA-Z0-9_]*)$/,
                  `@${mentionUser.username} `
                );

              setCommentText(newText);
              setCommentMentionSearch(null);
            }}
          >

            <div className="mention-user-avatar">
              {mentionUser.username
                .charAt(0)
                .toUpperCase()}
            </div>

            <span>
              @{mentionUser.username}
            </span>

          </button>

        ))}

      </div>
    )}

</div>


            <div className="comment-form-bottom">

              <div className="comment-file-section">

                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) =>
                    setCommentFile(
                      e.target.files[0]
                    )
                  }
                />

                {commentFile && (
                  <span className="comment-selected-file">
                    {commentFile.name}
                  </span>
                )}

              </div>


              <button
                type="submit"
                className="comment-submit-btn"
              >
                Add Comment
              </button>

            </div>

          </form>


          {/* COMMENTS */}

          <div className="comments-list">

            {comments.length === 0 && (
              <div className="no-comments">
                <p>No comments yet.</p>
                <span>
                  Start the discussion by adding a comment.
                </span>
              </div>
            )}


            {comments
              .filter((comment) => !comment.parent)
              .map((comment) => (

                <div
                  key={comment.id}
                  className="comment-card"
                >

                  <div className="comment-user">

                    <div className="comment-avatar">
                      {comment.username
                        ?.charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>
                      <strong>
                        {comment.username}
                      </strong>

                      <span>
                        Comment
                      </span>
                    </div>

                  </div>


                  <div className="comment-content">
                    <p>
                     {renderCommentText(comment.content)}
                    </p>
                  </div>


                  {comment.attachment && (
                    <div className="comment-attachment">

                      <a
                        href={comment.attachment}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View Attachment
                      </a>

                    </div>
                  )}


                  <button
                    className="reply-btn"
                    onClick={() =>
                      setReplyTo(comment.id)
                    }
                  >
                    Reply
                  </button>


                  {/* REPLY FORM */}

                  {replyTo === comment.id && (

                    <div className="reply-form">

  <div className="mention-input-wrapper">

  <textarea
    placeholder="Write your reply... Type @ to mention someone"
    value={replyText}
    onChange={(e) => {
      const value = e.target.value;

      setReplyText(value);
      setReplyMentionSearch(
        getMentionSearch(value)
      );
    }}
  />

  {replyMentionSearch !== null &&
    getFilteredUsers(
      replyMentionSearch,
      replyText
    ).length > 0 && (

      <div className="mention-suggestions">

        {getFilteredUsers(
          replyMentionSearch,
          replyText
        ).map((mentionUser) => (

          <button
            type="button"
            key={mentionUser.id}
            className="mention-suggestion-item"
            onClick={() => {

              const newText =
                replyText.replace(
                  /@([a-zA-Z0-9_]*)$/,
                  `@${mentionUser.username} `
                );

              setReplyText(newText);
              setReplyMentionSearch(null);
            }}
          >

            <div className="mention-user-avatar">
              {mentionUser.username
                .charAt(0)
                .toUpperCase()}
            </div>

            <span>
              @{mentionUser.username}
            </span>

          </button>

        ))}

      </div>
    )}

</div>

  <div className="reply-file-section">

    <input
      type="file"
      accept="image/*,.pdf"
      onChange={(e) =>
        setReplyFile(e.target.files[0])
      }
    />

    {replyFile && (
      <span className="reply-selected-file">
        Selected: {replyFile.name}
      </span>
    )}

  </div>

  <div className="reply-actions">

    <button
      className="reply-send-btn"
      onClick={() =>
        addReply(comment.id)
      }
    >
      Send Reply
    </button>

    <button
      className="reply-cancel-btn"
      onClick={() => {
        setReplyTo(null);
        setReplyText("");
        setReplyFile(null);
      }}
    >
      Cancel
    </button>

  </div>

</div>
                  )}


                  {/* REPLIES */}

                  <div className="replies-list">

                    {comments
                      .filter(
                        (reply) =>
                          reply.parent ===
                          comment.id
                      )
                      .map((reply) => (

                        <div
                          key={reply.id}
                          className="reply-card"
                        >

                          <div className="reply-user">

                            <div className="reply-avatar">
                              {reply.username
                                ?.charAt(0)
                                .toUpperCase()}
                            </div>

                            <strong>
                              {reply.username}
                            </strong>

                          </div>


                          <p>
                            {renderCommentText(reply.content)}
                          </p>


                          {reply.attachment && (
                            <a
                              href={
                                reply.attachment
                              }
                              target="_blank"
                              rel="noreferrer"
                            >
                              View Attachment
                            </a>
                          )}

                        </div>

                      ))}

                  </div>

                </div>

              ))}

          </div>

        </div>

      </div>

    </div>
  );
}

export default TaskDetails;