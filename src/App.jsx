import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];


export default function App () {
  const [friends, setFriends] = useState(initialFriends)
  const [showAddFriend, setShowAddFriend] = useState(false)
  const [selectedFriend, setSelectedFriend] = useState(null)

  function handleShowAddFriend () {
    setShowAddFriend(show => !show)
  }

  function handleAddFriend (friend) {
    setFriends(friends => [...friends, friend])
    setShowAddFriend(false)
  }

  function handleSelection(friend){
    setSelectedFriend((cur) => cur?.id === friend.id ? null : friend)
    setShowAddFriend(false)
  }

  function handleSplitBill(value){
    setFriends( (friends) => friends.map( (friend) => friend.id === selectedFriend.id ? {...friend, balance: friend.balance + value} : friend))
    setSelectedFriend(null)
  }

  return (
    <div className="app">
      <div className="sidebar">
        <Friendlist friends={friends} onSelection={handleSelection} selectedFriend={selectedFriend}/>
        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend}/>}
        <Button onClick={handleShowAddFriend}>{showAddFriend ? 'Close' : 'Add Friend'}</Button>
      </div>
      {selectedFriend && <FormSplitBill selectedFriend={selectedFriend} onSplitBill={handleSplitBill}/>}
    </div>
  )
}

function Friendlist ({friends, onSelection, selectedFriend}) {

  return (
    <ul>
      {friends.map(f => <Friend selectedFriend={selectedFriend} onSelection={onSelection} friendsObj={f} key={crypto.randomUUID()}/>)}
    </ul>
  )
}

function Friend ({friendsObj, onSelection, selectedFriend}) {
  const isSelected = selectedFriend?.id === friendsObj.id
  
  return (
    <li className={isSelected ? 'selected' : ''}>
      <img src={friendsObj.image} alt={friendsObj.name} />
      <h3>{friendsObj.name}</h3>

      {friendsObj.balance < 0 && (
        <p className="red">
          You owe {friendsObj.name} {Math.abs(friendsObj.balance)}€
        </p>
      )}

      {friendsObj.balance > 0 && (
        <p className="green">
          {friendsObj.name} owes you {friendsObj.balance}€
        </p>
      )}

      {friendsObj.balance === 0 && (
        <p>
          You and {friendsObj.name} are even
        </p>
      )}
      <Button onClick={()=>onSelection(friendsObj)}>{isSelected ? 'Close' : 'Select'}</Button>
    </li>
  )
}

const Button = ({children, onClick}) => <button onClick={onClick} className="button">{children}</button>


function FormAddFriend ({onAddFriend}) {
  const [name, setName] = useState('')
  const [image, setImage] = useState('https://i.pravatar.cc/48')

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!name || !image) return

    const id = crypto.randomUUID()
    const newFriend = {
      id, name, image: `${image}?=${id}`, balance: 0
    }

    onAddFriend(newFriend)
    setName('')
    setImage('https://i.pravatar.cc/48')
  }

  return(
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>🧑‍🤝‍🧑 Friend name</label>
      <input type="text" value={name} onChange={e => setName(e.target.value)}/>

      <label>🏜️ Image URL</label>
      <input type="text" value={image} onChange={e => setImage(e.target.value)}/>

      <Button>Add</Button>
    </form>
  )
}

function FormSplitBill ({selectedFriend, onSplitBill}){
  const [bill, setBill] = useState('')
  const [paidByUser, setPaidByUser] = useState('')
  const piadByFriend = bill ? bill - paidByUser : ''
  const [whoIsPaying, setWhoIsPaying] = useState('user')

  const handleSubmit = (e) => {
    e.preventDefault();

    if(!bill || !paidByUser) return;
    onSplitBill(whoIsPaying === 'user' ? piadByFriend : -paidByUser)
  }

  return(
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>

      <label>💰 Bill value</label>
      <input type="text" value={bill} onChange={e => setBill(+e.target.value)}/>

      <label>🧍 Your expense</label>
      <input type="text" value={paidByUser} onChange={e => setPaidByUser(+e.target.value > bill ? paidByUser : +e.target.value)}/>

      <label>🧑‍🤝‍🧑 {selectedFriend.name}`s expense</label>
      <input type="text" disabled value={piadByFriend}/>

      <label>🤑 Who is paying the bill</label>
      <select value={whoIsPaying} onChange={e => setWhoIsPaying(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>Split bill</Button>
    </form>
  )
}