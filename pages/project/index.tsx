import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import axios from "axios/dist/axios";
import SnackBar from "../../components/snackbar";
import TaskCard from "../../components/taskcard";
import Save from "@material-ui/icons/Save";
import { ProjectDataBase, ProjectTask } from "../../interfaces/props";
import { nanoid } from "nanoid";

const Pmgmt: React.FC<any> = () => {
  const router = useRouter();
  const { id } = router.query;
  const [open, setOpen] = useState<boolean>(false);
  const [dbName, setDbName] = useState<string>("Name");
  const [notStarted, setNotStarted] = useState<ProjectTask[]>([]);
  const [progress, setProgress] = useState<ProjectTask[]>([]);
  const [completed, setCompleted] = useState<ProjectTask[]>([]);
  const [taskText, setTaskText] = useState<string>("");
  const [dbDesc, setDesc] = useState<string>("Description");
  const [isLoading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (id) {
      axios
        .get<ProjectDataBase>(
          `https://pdb-api.eu-gb.cf.appdomain.cloud/database/public/${id}`
        )
        .then((res) => {
          console.dir(res.data);
          setDesc(res.data.description);
          setDbName(res.data.name);
          setNotStarted(res.data.body.notStarted);
          setProgress(res.data.body.progress);
          setCompleted(res.data.body.completed);
        });
      setLoading(false);
    }
  }, [router]);

  const onCardDrop = (e: any) => {
    e.preventDefault();
    let data = e.dataTransfer.getData("text");
    let id = e.dataTransfer.getData("id");
    let theTask: ProjectTask = {
      id: id,
      task: data,
    };
    let parentData = e.dataTransfer.getData("parent");
    console.log(parentData);
    // if the parent and target are same
    if (e.target.id == parentData) {
      return;
    }
    // add sequence
    if (e.target.id == "complete") {
      addToCompleted(theTask);
    }
    if (e.target.id == "nstart") {
      addToNotStarted(theTask);
    }
    if (e.target.id == "prog") {
      addToProgress(theTask);
    }
    // delete sequence
    if (parentData == "nstart") {
      removeFromNotStarted(id);
    }
    if (parentData == "prog") {
      removeFromProgress(id);
    }
    if (parentData == "complete") {
      removeFromCompleted(id);
    }
  };
  const allowDrop = (e: any) => {
    e.preventDefault();
  };
  const onCardDrag = (e: any) => {
    let [taskId, taskName] = e.target.id.toString().split(":");
    e.dataTransfer.setData("id", taskId);
    e.dataTransfer.setData("text", taskName);
    e.dataTransfer.setData("parent", e.target.parentNode.id);
    console.log(taskName);
  };
  const addToCompleted = (task: ProjectTask) => {
    let temp = completed;
    temp = [...completed, task];
    setCompleted(temp);
  };
  const addToProgress = (task: ProjectTask) => {
    let temp = progress;
    temp = [...progress, task];
    setProgress(temp);
  };
  const addToNotStarted = (task: ProjectTask) => {
    let temp = notStarted;
    temp = [...notStarted, task];
    setNotStarted(temp);
  };
  const removeFromNotStarted = (taskId: String) => {
    let temp = notStarted.filter((e) => e.id != taskId);
    setNotStarted(temp);
  };
  const removeFromProgress = (taskId: String) => {
    let temp = progress.filter((e) => e.id != taskId);
    setProgress(temp);
  };
  const removeFromCompleted = (taskId: String) => {
    let temp = completed.filter((e) => e.id != taskId);
    setCompleted(temp);
  };
  const saveData = async () => {
    const data = {
      completed: completed,
      progress: progress,
      notStarted: notStarted,
    };
    console.dir(data);
    const result = await axios.put(
      `https://pdb-api.eu-gb.cf.appdomain.cloud/project/${id}`,
      data,
      {
        headers: {
          "auth-token": localStorage.getItem("token"),
        },
      }
    );
    if (result.status == 200) {
      setOpen(true);
    }
  };
  const removeTask = (task: ProjectTask) => {
    let element: any = document.getElementById(`${task.id}:${task.task}`);
    if (element.parentNode.id == "nstart") {
      removeFromNotStarted(task.id);
    }
    if (element.parentNode.id == "prog") {
      removeFromProgress(task.id);
    }
    if (element.parentNode.id == "complete") {
      removeFromCompleted(task.id);
    }
  };

  return (
    <>
      <Head>
        <title>{dbName} - Project</title>
      </Head>
      <div className="m-5">
        <h1 className="m-1 text-white font-bold text-3xl">{dbName}</h1>
        <p className="m-1 text-white text-base">{dbDesc}</p>
        <div className="flex justify-center item-center content-center">
          <input
            className="flex p-2 border-transparent rounded-md shadow-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-600 bg-gray-800"
            type="text"
            id="standard-basic"
            value={taskText}
            placeholder="Enter new task"
            onChange={(e) => setTaskText(e.target.value)}
          />
          &nbsp; &nbsp; &nbsp;
          <button
            className="p-3 m-1 shadow-md rounded-md text-white bg-purple-600 transition duration-200 focus:ring focus:ring-purple-600 focus:ring-opacity-50 hover:bg-purple-700"
            onClick={() => {
              let newTask: ProjectTask = {
                id: nanoid(8),
                task: taskText,
              };
              addToNotStarted(newTask);
              setTaskText("");
            }}
          >
            Add Task
          </button>
        </div>
        <div className="flex mt-5 flex-row content-around">
          <div
            id="nstart"
            className="flex rounded-md flex-col bg-gray-800 holder p-2 m-2"
            onDrop={onCardDrop}
            onDragOver={allowDrop}
          >
            <h2 className="font-bold text-red-300 text-lg">Not Started</h2>
            {isLoading ? (
              <p>loading</p>
            ) : (
              notStarted.map((data, key) => (
                <TaskCard
                  key={key}
                  id={`${data.id}:${data.task}`}
                  onDrag={onCardDrag}
                  onDelete={() => removeTask(data)}
                  taskName={data.task}
                />
              ))
            )}
          </div>
          <div
            className="flex rounded-md flex-col bg-gray-800 holder p-2 m-2"
            id="prog"
            onDrop={onCardDrop}
            onDragOver={allowDrop}
          >
            <h2 className="font-bold text-yellow-300 text-lg">In Progress</h2>

            {isLoading ? (
              <p>loading</p>
            ) : (
              progress.map((data, key) => (
                <TaskCard
                  key={key}
                  id={`${data.id}:${data.task}`}
                  onDrag={onCardDrag}
                  onDelete={() => removeTask(data)}
                  taskName={data.task}
                />
              ))
            )}
          </div>
          <div
            id="complete"
            className="flex flex-col rounded-md bg-gray-800 holder p-2 m-2"
            onDrop={onCardDrop}
            onDragOver={allowDrop}
          >
            <h2 className="font-bold text-green-300 text-lg">Completed</h2>

            {isLoading ? (
              <p>loading</p>
            ) : (
              completed.map((data, key) => (
                <TaskCard
                  key={key}
                  id={`${data.id}:${data.task}`}
                  onDrag={onCardDrag}
                  onDelete={() => removeTask(data)}
                  taskName={data.task}
                />
              ))
            )}
          </div>
        </div>
        <SnackBar
          isOpen={open}
          content="Changes Saved Successfully ???????"
          onClose={() => setOpen(false)}
        />
        <button
          id="saveBtn"
          aria-label="add"
          className="flex p-3 bg-purple-600 transition rounded-md shadow-lg fab text-white hover:bg-purple-700 hover:rotate-45 focus:ring-2 ring-purple-400"
          onClick={saveData}
        >
          <Save />
        </button>
      </div>
    </>
  );
};

export default Pmgmt;
