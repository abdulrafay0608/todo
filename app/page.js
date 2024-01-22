'use client'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import React from 'react';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { RiDeleteBin5Fill } from "react-icons/ri";
import { FaEdit, FaSlack } from "react-icons/fa";
import { GiNotebook } from "react-icons/gi";
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

// import { addDoc, collection, getDocs, orderBy, query, where } from '@firebase/firestore';
import { auth, db } from './firebase/firebaseConfig';
// import { Loader } from './loader';
import { useAuth } from './firebase/auth';
import { Loader } from './loader';
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from '@firebase/firestore';

export default function Todo() {
  const route = useRouter()
  const { authUser, isLoading } = useAuth();
  const [todosss, setTodosss] = useState([])
  const [todo, setTodo] = useState("");
  const [updateTodo, setUpdateTodo] = useState(false)
  const [disable, setDisable] = useState(false);
  const [updateRef, setUpdateRef] = useState(false);

  const logOutHandler = () => {
    signOut(auth)
      .then(() => {
        toast.success('LogOut Successfully!', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
      }).catch((error) => {
      });
  }

  useEffect(() => {
    if (!authUser && !isLoading) {
      route.push("/login");
    }
    if (!!authUser) {
      fetchTodos(authUser.uid)
    }
    console.log(todosss);
  }, [authUser, isLoading]);

  const AddTodos = async () => {
    if (!todo) return toast.success('Please Enter a Todo!', {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    });
    setDisable(true)
    try {
      const docRef = await addDoc(collection(db, "todos"), {
        currentId: authUser.uid,
        todo: todo,
        completed: false,
      });
      setDisable(false)
      console.log("Document written with ID: ", docRef.id);
      fetchTodos(authUser.uid)
      setTodo("")
    } catch (err) {
      console.error(err);
    }
  }

  const fetchTodos = async (uid) => {
    try {
      const q = query(collection(db, "todos"), where("currentId", "==", uid));
      const querySnapshot = await getDocs(q);
      let todoArray = []
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        todoArray.push({ ...doc.data(), id: doc.id })
      });
      setTodosss(todoArray)
    } catch (err) {
      console.error(err);
    }
  }

  const deleteTodo = async (uid) => {
    try {
      setDisable(true)
      await deleteDoc(doc(db, "todos", uid));
      fetchTodos(authUser.uid);
      setDisable(false)
    } catch (error) {
      console.error("An error occured", error);
    }
  }

  const makeAsCompleteHander = async (e, uid) => {
    console.log(e.target.checked, uid);
    try {
      const todoRef = doc(db, "todos", uid);
      await updateDoc(todoRef, {
        completed: e.target.checked,
      });
      fetchTodos(authUser.uid);
    } catch (error) {
      console.error("An error occured", error);
    }
  };

  const onKeyUp = (e) => {
    if (e?.key === "Enter" && todo?.length > 0) {
      AddTodos();
    }
  };


  const onEdit = (todo, uid) => {
    try {
      setTodo(todo)
      setUpdateTodo(true)
      const todoRef = doc(db, "todos", uid);
      setUpdateRef(todoRef)
    } catch (err) {
      console.error(err)
    }
  }

  const onUpdateTodo = async () => {
    setDisable(true)
    try {
      await updateDoc(updateRef, {
        todo: todo,
      });
      fetchTodos(authUser.uid)
      setTodo("")
      setDisable(false)
    } catch (err) {
      console.error(err)
    }
  }

  return !authUser ? (<Loader />) : (
    <main className="relative flex min-h-screen flex-col items-center justify-between bg-black/50 md:p-12 p-0">
      <div className="bg-lightsteelblue md:p-6 py-6 px-3 rounded-md w-full md:w-6/12 ">
        <div className="flex justify-center items-center gap-2 bg-slate-400 p-5 text-white text-center text-3xl font-bold rounded-md">
          <GiNotebook size={30} color='#fff' />
          <h2>Todo App</h2>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="flex justify-between items-center w-full py-6">
          <input
            className="bg-transparent border-2 border-slate-400 placeholder:text-white placeholder:text-sm w-9/12 p-2 pl-6 text-white focus:outline-none"
            type="text"
            placeholder="👏 Hello , What to do Today"
            name="text"
            value={todo}
            onKeyUp={onKeyUp}
            onChange={(e) => setTodo(e.target.value)}
            required
          />
          <button
            disabled={disable}
            onClick={() => (updateTodo ? onUpdateTodo() : AddTodos())}
            className={`w-3/12 p-2 hover:bg-slate-500  hover:border-slate-500 text-white font-bold bg-slate-400  border-2 border-slate-400 ${disable ? "cursor-not-allowed" : ""}`}
          >
            {updateTodo ? 'Update' : 'Add'}
          </button>

        </form>

        <ul>
          {todosss?.map((val, i) => (
            <div key={i} className="bg-slate-400 text-white  my-3 px-2 flex items-center justify-between">
              <div className='flex justify-center items-center gap-1 md:gap-2' >
                <input
                  id={`todo-${val.id}`}
                  type="checkbox"
                  className="w-4 h-4 accent-green-400 rounded-lg"
                  checked={val.completed}
                  onChange={(e) => makeAsCompleteHander(e, val.id)} />
                <label
                  htmlFor={`todo-${val.id}`}
                  className={`font-medium ${val.completed ? "line-through text-black" : ""}`}>
                  {val.todo}
                </label>
              </div>
              <div className='flex justify-center items-center'>
                <button
                  disabled={disable}
                  value={val.id}
                  onClick={() => onEdit(val.todo, val.id)}
                  className={`m-2 p-2 bg-teal-700 hover:bg-teal-800	rounded ${disable ? "cursor-not-allowed" : ""}`}>
                  <FaEdit color={"#fff"} size={20} />
                  <ToastContainer />
                </button>
                <button
                  value={val.id}
                  onClick={() => deleteTodo(val.id)}
                  disabled={disable}
                  className={`m-1 p-2 bg-red-600 hover:bg-red-700 rounded ${disable ? "cursor-not-allowed" : ""}`}>
                  <RiDeleteBin5Fill color={"#fff"} size={20} />
                  <ToastContainer />
                </button>
              </div>
            </div>
          ))}
        </ul>
      </div>
      <div className='absolute bottom-1 right-1 md:bottom-5 md:right-6'>
        <button
          onClick={logOutHandler}
          className="flex justify-center items-center m-2 p-3 bg-slate-400 hover:bg-slate-500 rounded"
        >
          <RiDeleteBin5Fill color={"#fff"} size={22} />
          <span className='mx-2 text-white font-bold'>Logout</span>
          <ToastContainer />
        </button>
      </div>
    </main >
  )
}
