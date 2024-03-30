import Notice from "../models/notification.js";
import Task from "../models/task.js";
import User from "../models/user.model.js";

export const createTask = async (req, res) => {
  try {
    const { userId } = req.body;

    const { title, team, stage, date, priority, assets } = req.body;

    let text = "New task has been assigned to you";
    if (team?.length > 1) {
      text = text + ` and ${team?.length - 1} others.`;
    }

    text =
      text +
      ` The task priority is set a ${priority} priority, so check and act accordingly. The task date is ${new Date(
        date
      ).toDateString()}. Thank you!!!`;

    const activity = {
      type: "assigned",
      activity: text,
      by: userId,
    };

    const task = await Task.create({
      title,
      team,
      stage: stage.toLowerCase(),
      date,
      priority: priority.toLowerCase(),
      assets,
      activities: activity,
    });

    await Notice.create({
      team,
      text,
      task: task._id,
    });

    res
      .status(200)
      .json({ status: true, task, message: "Task created successfully." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const duplicateTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);

    const newTask = await Task.create({
      ...task,
      title: task.title + " - Duplicate",
    });

    newTask.team = task.team;
    newTask.subTasks = task.subTasks;
    newTask.assets = task.assets;
    newTask.priority = task.priority;
    newTask.stage = task.stage;

    await newTask.save();

    //alert users of the task
    let text = "New task has been assigned to you";
    if (task.team.length > 1) {
      text = text + ` and ${task.team.length - 1} others.`;
    }

    text =
      text +
      ` The task priority is set a ${
        task.priority
      } priority, so check and act accordingly. The task date is ${task.date.toDateString()}. Thank you!!!`;

    await Notice.create({
      team: task.team,
      text,
      task: newTask._id,
    });

    res
      .status(200)
      .json({ status: true, message: "Task duplicated successfully." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const postTaskActivity = async (req, res) => {
  try {
    const { taskId } = req.body;
    const { type, activity } = req.body;

    // Check if the task exists and has activities
    const task = await Task.findById(taskId);
    if (!task || !task.activities) {
      throw new Error('Task not found or has no activities');
    }

    const data = {
      type,
      activity,
    };

    task.activities.push(data);

    await task.save();

    res.status(200).json({ status: true, message: "Activity posted successfully." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const dashboardStatistics = async (req, res) => {
  try {
    const { userId, isManager } = req.body;

    const allTasks = await Task.find({
          isTrashed: false })
  

    const users = await User.find()
      .select("name title role isManager createdAt")
      .limit(10)
      .sort({ _id: -1 });

    //   group task by stage and calculate counts
    const groupTaskks = allTasks.reduce((result, task) => {
      const stage = task.stage;

      if (!result[stage]) {
        result[stage] = 1;
      } else {
        result[stage] += 1;
      }

      return result;
    }, {});

    // Group tasks by priority
    const groupData = Object.entries(
      allTasks.reduce((result, task) => {
        const { priority } = task;

        result[priority] = (result[priority] || 0) + 1;
        return result;
      }, {})
    ).map(([name, total]) => ({ name, total }));

    // calculate total tasks
    const totalTasks = allTasks?.length;
    const last10Task = allTasks?.slice(0, 10);

    const summary = {
      totalTasks,
      last10Task,
      users: isManager ? users : [],
      tasks: groupTaskks,
      graphData: groupData,
    };

    res.status(200).json({
      status: true,
      message: "Successfully",
      ...summary,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const { stage, isTrashed, userId } = req.query;

    let query = { isTrashed: isTrashed ? true : false };

    if (stage) {
      query.stage = stage;
    }

    if (userId) {
      query['activities.by'] = userId; // Filter tasks by user ID
    }

    let queryResult = Task.find(query)
      .populate({
        path: "team",
        select: "username",
      })
      .populate({
        path: "project",
        select: "name",
      })
      .sort({ _id: -1 });

    const tasks = await queryResult;

    res.status(200).json({
      status: true,
      tasks,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Failed to fetch tasks" });
  }
};


export const getTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id)
      .populate({
        path: "team",
        select: "usename",
      })
      .populate({
        path: "activities.by",
        select: "activity",
      });

    res.status(200).json({
      status: true,
      task,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const createSubTask = async (req, res) => {
  try {
    const { title, tag, date } = req.body;
    const { id } = req.body;

    const newSubTask = {
      title,
      date,
      tag,
    };

    const task = await Task.find();

    task.subTasks.push(newSubTask);

    await task.save();

    res.status(200).js;
    on({ status: true, message: "SubTask added successfully." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, date, team, stage, priority, assets } = req.body;

    const task = await Task.findById(id);

    task.title = title;
    task.date = date;
    task.priority = priority.toLowerCase();
    task.assets = assets;
    task.stage = stage.toLowerCase();
    task.team = team;

    await task.save();

    res
      .status(200)
      .json({ status: true, message: "Task duplicated successfully." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const trashTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);

    task.isTrashed = true;

    await task.save();

    res.status(200).json({
      status: true,
      message: `Task trashed successfully.`,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const deleteRestoreTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { actionType } = req.query;

    if (actionType === "delete") {
      await Task.findByIdAndDelete(id);
    } else if (actionType === "deleteAll") {
      await Task.deleteMany({ isTrashed: true });
    } else if (actionType === "restore") {
      const resp = await Task.findById(id);

      resp.isTrashed = false;
      resp.save();
    } else if (actionType === "restoreAll") {
      await Task.updateMany(
        { isTrashed: true },
        { $set: { isTrashed: false } }
      );
    }

    res.status(200).json({
      status: true,
      message: `Operation performed successfully.`,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

// Controller function to get notice data
export const getNoticeData = async (req, res) => {
  try {
    const notices = await Notice.find().populate("team").populate("task").populate("isRead");
    res.status(200).json(notices);
  } catch (error) {
    console.error("Error fetching notice data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const handleChangeStage = async (taskId, newStage) => {
  try {
    // Find the task by its ID
    const task = await Task.findById(taskId);

    if (!task) {
      console.log(`Task with ID ${taskId} not found`);
      return; // Exit function if task not found
    }

    // Check the current stage of the task and update it accordingly
    if (task.stage === "todo" && newStage === "in progress") {
      task.stage = "in progress";
    } else if (task.stage === "in progress" && newStage === "completed") {
      task.stage = "completed";
    } else {
      console.log(`Invalid stage transition from ${task.stage} to ${newStage}`);
      return; // Exit function if the stage transition is invalid
    }

    // Save the updated task
    await task.save();

    console.log(`Stage of task ${taskId} updated to ${task.stage}`);
  } catch (error) {
    console.error(`Error updating stage of task ${taskId}:`, error);
  }
};



export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the task by ID and delete it
    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      // If task with the given ID doesn't exist
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // If task is successfully deleted
    res.status(200).json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    // If any error occurs during deletion
    console.error('Error deleting task:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};