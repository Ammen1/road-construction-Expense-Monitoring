const ProjectCard = ({ project }) => {
  const { name, startDate, endDate, status, tasks, suppliers, budget } =
    project;

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-4 mb-4">
      <div className="mt-4">
        <h4 className="text-lg font-semibold mb-2">Tasks:</h4>
        <ul className="list-disc pl-5">
          {tasks.map((task) => (
            <li key={task._id} className="text-gray-600 dark:text-gray-400">
              {task.name}
              {task.status}
              {task.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4">
        <h4 className="text-lg font-semibold mb-2">Budget:</h4>
        <ul className="list-disc pl-5">
          <li className="text-gray-600 dark:text-gray-400">
            Materials: {budget.materials}
          </li>
          <li className="text-gray-600 dark:text-gray-400">
            Labor: {budget.labor}
          </li>
          <li className="text-gray-600 dark:text-gray-400">
            Equipment: {budget.equipment}
          </li>
          <li className="text-gray-600 dark:text-gray-400">
            Permits: {budget.permits}
          </li>
          <li className="text-gray-600 dark:text-gray-400">
            Other: {budget.other}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProjectCard;
