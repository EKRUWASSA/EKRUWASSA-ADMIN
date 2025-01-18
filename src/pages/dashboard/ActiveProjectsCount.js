import React, { useMemo } from "react";
import { Chart } from "react-google-charts";

const ActiveProjectsCount = ({ projects }) => {
  const projectCounts = useMemo(() => {
    if (!projects)
      return [
        ["Project Status", "Count"],
        ["Active Projects", 0],
        ["Completed Projects", 0],
      ];

    const totalProjects = projects.length;
    const activeProjects = projects.filter((project) => !project.completed)
      .length;
    const completedProjects = totalProjects - activeProjects;

    const activePercentage = totalProjects
      ? ((activeProjects / totalProjects) * 100).toFixed(1)
      : 0;
    const completedPercentage = totalProjects
      ? ((completedProjects / totalProjects) * 100).toFixed(1)
      : 0;

    return [
      ["Project Status", "Count"],
      [
        `Active Projects (${activeProjects})`,
        activeProjects,
      ],
      [
        `Completed Projects (${completedProjects})`,
        completedProjects,
      ],
    ];
  }, [projects]);

  const options = {
    title: "",
    pieHole: 0.8,
    colors: ["#36A2EB", "#FFCE56"],
    fontName: "Arial",
    fontSize: 14,
    titleTextStyle: {
      fontName: "Arial",
      fontSize: 16,
      bold: true,
    },
    legendTextStyle: {
      fontName: "Arial",
      fontSize: 12,
    },
    pieSliceText: "label", // Display label inside each slice
    pieSliceTextStyle: {
      fontName: "Arial",
      fontSize: 12,
    },
    tooltip: {
      trigger: "selection", // Display tooltip only on hover
    },
  };

  return (
    <div>
      <Chart
        chartType="PieChart"
        data={projectCounts}
        options={options}
        width="100%"
        height="250px"
      />
    </div>
  );
};

export default ActiveProjectsCount;
