import { useState, useEffect } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Select, MenuItem } from "@mui/material";

const PeopleGroup = () => {
  const [dropDownOption, setDropDownOption] = useState(false);
  const [showMembers, setShowMembers] = useState(true);
  const [currentGroupIndex, setCurrentGroupIndex] = useState(null);
  const [people, setPeople] = useState([
    { id: 1, name: "John", selected: false },
    { id: 2, name: "Jane", selected: false },
    { id: 3, name: "Michael", selected: false },
  ]);

  const [groupName, setGroupName] = useState("");
  const [groups, setGroups] = useState([
    {
      name: "",
      members: [{ id: 0, name: "", selected: false }],
      active: false,
    },
  ]);
  const [currentGroup, setCurrentGroup] = useState(null);

  const handlePersonClick = (id) => {
    const updatedPeople = people.map((person) => {
      if (person.id === id) {
        return { ...person, selected: !person.selected };
      }
      return person;
    });
    setPeople(updatedPeople);
  };

  const handleCreateGroup = () => {
    const newGroup = {
      name: groupName,
      members: [],
    };
    setGroups([...groups, newGroup]);
    setGroupName("");
  };

  const handleGroupClick = (group) => {
    setCurrentGroup(group);
  };

  const addMemberToGroup = (peopleData = {}, index) => {
    setCurrentGroupIndex(index);
    groups[index].members.push(peopleData);
  };

  const handleAddPersonToGroup = (person) => {
    const updatedGroups = groups.map((group) => {
      if (group === currentGroup) {
        return {
          ...group,
          members: [...group.members, person.name],
        };
      }
      return group;
    });
    setGroups(updatedGroups);
  };

  const handleShowPeople = () => {
    setShowPeople(true);
  };
  const handleIconClick = (group) => {
    setDropDownOption(true);
  };

  return (
    <div>
      <h2>People</h2>
      <ul>
        {people.map((person) => (
          <li
            key={person.id}
            className={person.selected ? "selected" : ""}
            onClick={() => handlePersonClick(person.id)}
          >
            {person.name}
          </li>
        ))}
      </ul>

      <div>
        <h2>Create Group</h2>
        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Group Name"
        />
        <button onClick={handleCreateGroup}>Create Group</button>
      </div>

      <div>
        <h2>Groups</h2>
        <ul>
          {groups.map((group, index) => (
            <li
              key={index}
              className={currentGroup === group ? "selected" : ""}
              onClick={() => handleGroupClick(group)}
            >
              <div className="Groups">
                <h3>{group.name}</h3>
                <AddCircleOutlineIcon onClick={() => handleIconClick(group)} />
                {dropDownOption && (
                  <ul>
                    {people.map((peopleData, i) => (
                      <li
                        key={i}
                        value={peopleData.name}
                        onClick={() => addMemberToGroup(peopleData, index)}
                      >
                        {peopleData.name}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="GroupMembers">
                  {console.log("currentGroupIndex")}
                  {console.log(currentGroupIndex)}
                  {console.log(groups)}
                  {console.log(groups[currentGroupIndex])}
                  {currentGroupIndex &&
                    groups[currentGroupIndex].members.map((x) => {
                      {
                        console.log("jhgf");
                      }
                      {
                        console.log(x.name);
                      }
                      return (
                        <div key={x.id}>
                          <h1>{x.name}</h1>
                          <br />
                        </div>
                      );
                    })}
                </div>
              </div>
              {currentGroup === group && (
                <button onClick={handleShowPeople}>Add People</button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PeopleGroup;
