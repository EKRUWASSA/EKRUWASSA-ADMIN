import { useEffect, useState } from "react";
import dropDownIcon from "../../assets/drop.svg";

const filterList = [ "Active", "Completed"];

export default function ProjectsFilter({ currentFilter, changeFilter }) {
  const [width, setWidth] = useState(window.innerWidth);
  const [dropOpen, setDropOpen] = useState(false);

  useEffect(() => {
    window.addEventListener("resize", () => setWidth(window.innerWidth));
    return () => window.removeEventListener("resize", () => setWidth(window.innerWidth));
  }, []);

  const breakpoint = 700;

  const handleFilter = (newFilter) => {
    changeFilter(newFilter);
  };

  return (
    <>
      {width >= breakpoint ? (
        <div className="project-filter">
          <nav>
            <p>PROJECT LIST</p>
           
          </nav>
          <div className="flex gap-4">
          {filterList.map((i) => (
              <button
                key={i}
                onClick={() => {
                  handleFilter(i);
                }}
                className={currentFilter === i ? "active" : ""}
              >
                {i}
              </button>
            ))}
          </div>
        </div>
        
      ) : (
        <div className="menu-container">
          <div className="drop-down-container">
          <p>PROJECT LIST</p>
            {/* <p>
              filter by: <span>{` ${currentFilter}`}</span>
            </p> */}
            {/* <img
              src={dropDownIcon}
              alt="dropDown"
              onClick={() => {
                setDropOpen(!dropOpen);
              }}
            /> */}
          </div>

          {dropOpen && (
            <nav>
              {filterList.map((i) => (
                <button
                  key={i}
                  onClick={() => {
                    handleFilter(i);
                    setDropOpen(false);
                  }}
                  className={currentFilter === i ? "active" : ""}
                >
                  {i}omom
                </button>
              ))}
            </nav>
          )}
        </div>
      )}
    </>
  );
}
