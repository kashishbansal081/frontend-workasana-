import { useEffect, useState } from "react";
import SideBar from "../../components/Layout/SideBar";
import "./teams.css";
import {API} from "../../services/Api";

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);

  const [newTeamModalOpen, setNewTeamModalOpen] =
    useState(false);

  const [teamName, setTeamName] = useState("");
  const [description, setDescription] = useState("");
  const [owner, setOwner] = useState("");
  const [members, setMembers] = useState([]);

  const [newMember, setNewMember] = useState("");

  const token = localStorage.getItem("token");

  const authHeaders = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const fetchTeams = async () => {
    try {
      const res = await fetch(
        API.teams,
        {
          headers: authHeaders,
        },
      );

      const data = await res.json();

      setTeams(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(
        API.users,
        {
          headers: authHeaders,
        },
      );

      const data = await res.json();

      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTeams();
    fetchUsers();
  }, []);

  const handleTeamClick = async (id) => {
    try {
      const res = await fetch(
        `${API.teams}/${id}`,
        {
          headers: authHeaders,
        },
      );

      const data = await res.json();

      setSelectedTeam(data);
    } catch (err) {
      console.error(err);
    }
  };

  const getInitials = (name) => {
    if (!name) return "??";

    const words = name.split(" ");

    return words.length === 1
      ? words[0].slice(0, 2).toUpperCase()
      : (words[0][0] + words[1][0]).toUpperCase();
  };

  const addMember = (userId) => {
    if (!userId) return;

    if (members.includes(userId)) return;

    setMembers([...members, userId]);
  };

  const removeMember = (userId) => {
    const filtered = members.filter((id) => id !== userId);

    setMembers(filtered);
  };

  const createTeam = async () => {
    try {
      if (!teamName.trim()) {
        alert("Please enter team name");
        return;
      }

      if (!owner) {
        alert("Please select owner");
        return;
      }

      const response = await fetch(
        API.teams,
        {
          method: "POST",

          headers: authHeaders,

          body: JSON.stringify({
            name: teamName,
            description,
            owner,
            members,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to create team");
        return;
      }

      fetchTeams();

      setTeamName("");
      setDescription("");
      setOwner("");
      setMembers([]);

      setNewTeamModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const addMemberToTeam = async () => {
    try {
      if (!newMember) return;

      const updatedMembers = [
        ...selectedTeam.members.map((m) => m._id),
        newMember,
      ];

      const response = await fetch(
        `${API.teams}/${selectedTeam._id}`,
        {
          method: "PUT",

          headers: authHeaders,

          body: JSON.stringify({
            members: updatedMembers,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to add member");
        return;
      }

      handleTeamClick(selectedTeam._id);

      setNewMember("");
    } catch (err) {
      console.error(err);
    }
  };

  const removeExistingMember = async (memberId) => {
    try {
      const response = await fetch(
        `${API.teams}/${selectedTeam._id}/members/${memberId}`,
        {
          method: "DELETE",

          headers: authHeaders,
        },
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to remove member");
        return;
      }

      handleTeamClick(selectedTeam._id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="teams-page">
      <div className="teams-sidebar">
        <SideBar />
      </div>

      <div className="teams-content">
        {!selectedTeam ? (
          <>
            <div className="teams-header">
              <div>
                <h2>Teams</h2>

                <p>{teams.length} teams available</p>
              </div>

              <button
                className="teams-btn-primary"
                onClick={() =>
                  setNewTeamModalOpen(true)
                }
              >
                + New Team
              </button>
            </div>

            {teams.length === 0 ? (
              <div className="teams-empty">
                <h3>No Teams Found</h3>

                <p>Create your first team.</p>
              </div>
            ) : (
              <div className="teams-grid">
                {teams.map((team) => (
                  <div
                    key={team._id}
                    className="teams-card"
                    onClick={() =>
                      handleTeamClick(team._id)
                    }
                  >
                    <div className="teams-card-top">
                      <div className="teams-avatar">
                        {getInitials(team.name)}
                      </div>

                      <span className="teams-count">
                        {team.members?.length || 0} Members
                      </span>
                    </div>

                    <h3>{team.name}</h3>

                    <p className="teams-description">
                      {team.description ||
                        "No description"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <button
              className="teams-back-btn"
              onClick={() => setSelectedTeam(null)}
            >
              ← Back
            </button>

            <div className="teams-detail-card">
              <div className="teams-avatar large">
                {getInitials(selectedTeam.name)}
              </div>

              <div>
                <h3 className="mb-0">
                  {selectedTeam.name}
                </h3>

                <p
                  className="mb-0 text-muted mt-1"
                  style={{ fontSize: "14px" }}
                >
                  {selectedTeam.members?.length || 0}{" "}
                  members
                </p>

                <p
                  className="teams-description mb-0 mt-1"
                  style={{ fontSize: "14px" }}
                >
                  {selectedTeam.description}
                </p>
              </div>
            </div>

            <div className="teams-members-box">
              <h3 className="mb-0">Owner</h3>

              {selectedTeam.owner && (
                <div className="teams-member-row-view">
                  <div className="teams-member-left">
                    <div className="teams-avatar small">
                      {getInitials(
                        selectedTeam.owner?.name,
                      )}
                    </div>

                    <div>
                      <p className="teams-member-name">
                        {selectedTeam.owner?.name}
                      </p>

                      <p className="teams-member-role">
                        Team Owner
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="teams-members-box">
              <div className="teams-members-header">
                <h3 className="mb-0">Members</h3>

                <div className="teams-add-member-box">
                  <select
                    className="teams-input small"
                    value={newMember}
                    onChange={(e) =>
                      setNewMember(e.target.value)
                    }
                  >
                    <option value="">
                      Select User
                    </option>

                    {users
                      .filter(
                        (user) =>
                          !selectedTeam.members.some(
                            (member) =>
                              member._id === user._id,
                          ),
                      )
                      .map((user) => (
                        <option
                          key={user._id}
                          value={user._id}
                        >
                          {user.name}
                        </option>
                      ))}
                  </select>

                  <button
                    className="teams-btn-primary"
                    onClick={addMemberToTeam}
                  >
                    Add
                  </button>
                </div>
              </div>

              {selectedTeam.members?.map((member) => (
                <div
                  key={member._id}
                  className="teams-member-row-view"
                >
                  <div className="teams-member-left">
                    <div className="teams-avatar small">
                      {getInitials(member.name)}
                    </div>

                    <div>
                      <p className="teams-member-name">
                        {member.name}
                      </p>

                      <p className="teams-member-role">
                        Team Member
                      </p>
                    </div>
                  </div>

                  <button
                    className="teams-remove-btn"
                    onClick={() =>
                      removeExistingMember(
                        member._id,
                      )
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {newTeamModalOpen && (
        <div className="teams-modal-overlay">
          <div className="teams-modal">
            <div className="teams-modal-header">
              <h3>Create Team</h3>

              <button
                className="teams-close-btn"
                onClick={() =>
                  setNewTeamModalOpen(false)
                }
              >
                ✕
              </button>
            </div>

            <div className="teams-modal-body">
              <input
                type="text"
                placeholder="Team Name"
                className="teams-input"
                value={teamName}
                onChange={(e) =>
                  setTeamName(e.target.value)
                }
              />

              <textarea
                placeholder="Team Description"
                className="teams-textarea"
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
              />

              <div>
                <label className="teams-label">
                  Select Owner
                </label>

                <select
                  className="teams-input"
                  value={owner}
                  onChange={(e) =>
                    setOwner(e.target.value)
                  }
                >
                  <option value="">
                    Select Owner
                  </option>

                  {users.map((user) => (
                    <option
                      key={user._id}
                      value={user._id}
                    >
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="teams-label">
                  Add Members
                </label>

                <select
                  className="teams-input"
                  onChange={(e) =>
                    addMember(e.target.value)
                  }
                >
                  <option value="">
                    Select Team Member
                  </option>

                  {users.map((user) => (
                    <option
                      key={user._id}
                      value={user._id}
                    >
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="teams-selected-members">
                {members.map((memberId) => {
                  const user = users.find(
                    (u) => u._id === memberId,
                  );

                  return (
                    <div
                      key={memberId}
                      className="teams-member-pill"
                    >
                      {user?.name}

                      <button
                        onClick={() =>
                          removeMember(memberId)
                        }
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>

              <button
                className="teams-btn-primary teams-full-width"
                onClick={createTeam}
              >
                Create Team
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}