import Authentication from '@/helper/authentication'
import dataUpload from '@/helper/dataUpload'
import { useState, useEffect } from 'react'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import axios from 'axios'
import styles from '../styles/SuperAdminPage.module.css'
import { useRouter } from 'next/router'
import { ROLES } from '@/constants'
import Cookies from 'js-cookie'

const SuperAdminPage = () => {
  const router = useRouter()
  const [isVerified, setIsVerified] = useState(false)
  const [dropDownOption, setDropDownOption] = useState(false)
  const [showMembers, setShowMembers] = useState(true)
  const [currentGroupIndex, setCurrentGroupIndex] = useState(1)
  const [people, setPeople] = useState([])
  const [peopleToUpdate, setPeopleToUpdate] = useState([])
  const [groupName, setGroupName] = useState('')
  const [groups, setGroups] = useState([
    { id: '', name: '', members: [], active: false }
  ])
  const [newGroupsId, setNewGroupsId] = useState([])
  const [currentGroup, setCurrentGroup] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const verified = await Authentication.verify()
        const { data } = verified
        const { success, existingUserData: { role } } = data
        if (success && role === ROLES.SUPER_ADMIN) {
          const response = await axios.get(
            'http://localhost:8000/api/v1/route/'
          )
          const groupData = await axios.get(
            'http://localhost:8000/api/v1/route/getGroup/all'
          )
          const { data: allTheGroup } = groupData
          console.log('groupData')
          console.log(response)
          let { data: peopleData } = response
          console.log(peopleData)
          peopleData = peopleData.filter(
            (peopleFilteredData) => peopleFilteredData.groupid != true
          )
          console.log(peopleData)
          setPeople(peopleData)
          setGroups(allTheGroup)
        } else if (success && role !== ROLES.SUPER_ADMIN) {
          console.log('Unauthorizsed')
          router.push('/UnAuthorised')
        } else {
          router.push('/Login')
        }
        setIsVerified(success)
      } catch (e) {
        console.log('Error while fetchData ' + e)
      }
    }
    fetchData()
  }, [isVerified])

  const saveToDatabase = () => {
    console.log('All groups')
    const oldGroups = groups.filter(
      (element) => !newGroupsId.includes(element.id)
    )
    const newGroups = groups.filter((element) =>
      newGroupsId.includes(element.id)
    )
    console.log(groups)
    console.log(people)
    console.log(peopleToUpdate)
    dataUpload.upload('SUPER_ADMIN', { oldGroups, peopleToUpdate, newGroups })
    setNewGroupsId([])
  }

  const LogOut = async () => {
    Cookies.remove('token')
    setIsVerified(false)
    const logOut = await axios.get(
      'http://localhost:8000/authenticate/logOut'
    )
  }

  const handlePersonClick = (id) => {
    const updatedPeople = people.map((person) => {
      if (person.id === id) {
        return { ...person, selected: !person.selected }
      }
      return person
    })
    setPeople(updatedPeople)
  }

  const handleCreateGroup = async () => {
    const newGroup = {
      id: Date.now(),
      name: groupName,
      members: []
    }
    setNewGroupsId([...newGroupsId, newGroup.id])
    const conCatGroup = [...groups, newGroup]
    console.log(conCatGroup)
    setGroups(conCatGroup)
    setGroupName('')
    console.log('groups')
    console.log(groups)
  }

  const handleGroupClick = (group) => {
    setCurrentGroup(group)
  }

  const addMemberToGroup = (peopleData, index, peopleId, groupid) => {
    const updatedPeople = people.filter((person) => person.id !== peopleId)
    peopleData.groupid = groupid
    console.log('peopleData')
    console.log(peopleData)
    setPeople(updatedPeople)
    const peopleWithGroupId = [...peopleToUpdate, peopleData]
    setPeopleToUpdate(peopleWithGroupId)
    setCurrentGroupIndex(index)
    const updatedGroups = groups.map((group, i) => {
      if (i === index) {
        return {
          ...group,
          members: [...group.members, peopleData]
        }
      }
      return group
    })
    setGroups(updatedGroups)
  }

  const handleShowPeople = () => {
    setShowMembers(!showMembers)
    setDropDownOption(false)
  }

  if (!isVerified) {
    return null // Render nothing until the verification is complete
  }

  return (
    <div>
      <h2>People</h2>
      <ul className={styles['people-list']}>
        {people.map((person) => (
          <li key={person.id}>{person.name}</li>
        ))}
      </ul>

      <div className={styles['create-group']}>
        <h2>Create Group</h2>
        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Group Name"
        />
        <button onClick={handleCreateGroup}>Create Group</button>
      </div>

      <div className={styles['groups-container']}>
        <h2>Groups</h2>
        <ul className={styles['groups-list']}>
          {groups.map((group, index) => (
            <li
              key={group.id}
              onClick={() => {
                setCurrentGroupIndex(index)
                handleGroupClick(group)
              }}
            >
              <div className={styles['group-details']}>
                {console.log(group)}
                <h3>{group.groupname || group.name}</h3>
                {currentGroupIndex === index
                  ? (
                  <AddCircleOutlineIcon
                    onClick={() => setDropDownOption(true)}
                  />
                    )
                  : null}
                <RemoveCircleOutlineIcon onClick={handleShowPeople} />
                {dropDownOption && currentGroupIndex === index && (
                  <ul className={styles['dropdown-menu']}>
                    {people.map((peopleData) => (
                      <li
                        key={peopleData.id}
                        value={peopleData.name}
                        onClick={() =>
                          addMemberToGroup(
                            peopleData,
                            index,
                            peopleData.id,
                            group.id
                          )
                        }
                      >
                        {peopleData.name}
                      </li>
                    ))}
                  </ul>
                )}
                <div className={styles['group-members']}>
                  {group.members.map((x) => (
                    <div key={x.id}>
                      <h1>{x.name}</h1>
                    </div>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <button onClick={() => saveToDatabase()}>Save</button>
      <button onClick={() => LogOut()}>LogOut</button>
    </div>
  )
}

export default SuperAdminPage
