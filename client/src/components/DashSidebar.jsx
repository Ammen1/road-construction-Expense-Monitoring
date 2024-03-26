import { Sidebar } from "flowbite-react";
import {
  HiUser,
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUserGroup,
  HiAnnotation,
  HiChartPie,
  HiTranslate,
  HiBell,
  HiOutlineBadgeCheck,
  HiCalendar,
  HiEmojiHappy,
  HiOutlineThumbDown,
  HiPlus,
} from "react-icons/hi";
import {
  MdAttachFile,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardArrowUp,
  MdOutlineKeyboardDoubleArrowDown,
} from "react-icons/md";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { signoutSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

export default function DashSidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const getLabelBasedOnRole = () => {
    if (currentUser.isAdmin) {
      return "Admin";
    } else if (currentUser.isManager) {
      return "Manager";
    } else if (currentUser.isSupplier) {
      return "Supplier";
    } else if (currentUser.isFinance) {
      return "Finance";
    } else if (currentUser.isEmployee) {
      return "Employee";
    }  else {
      return "User";
    }
  };
  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          {currentUser && currentUser.isAdmin && (
            <Link to="/dashboard?tab=dash">
              <Sidebar.Item
                active={tab === "dash" || !tab}
                icon={HiChartPie}
                as="div"
              >
                Dashboard
              </Sidebar.Item>
            </Link>
          )}
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={getLabelBasedOnRole()}
              labelColor="dark"
              as="div"
            >
              Profile
            </Sidebar.Item>
          </Link>
          {currentUser && currentUser.isManager && (
          <Link to="/dashboard?tab=dashs">
          <Sidebar.Item
            active={tab === "dashs"}
            icon={HiAnnotation}
            as="div"
          >
            DashBoard
          </Sidebar.Item>
          </Link>
          )}
          {currentUser && currentUser.isManager && (
          <Link to="/dashboard?tab=tasks">
          <Sidebar.Item
            active={tab === "tasks"}
            icon={MdAttachFile}
            as="div"
          >
            Tasks
          </Sidebar.Item>
          </Link>
          )}
          {currentUser && currentUser.isManager && (
          <Link to="/dashboard?tab=report">
          <Sidebar.Item
            active={tab === "report"}
            icon={HiDocumentText}
            as="div"
          >
            Generat Report
          </Sidebar.Item>
          </Link>
          )}
          {currentUser && currentUser.isManager && (
           <Link to="/dashboard?tab=create-expense">
           <Sidebar.Item
             active={tab === "create-expense"}
             icon={HiBell}
             as="div"
           >
             Notifications
           </Sidebar.Item>
         </Link>
          )}
          {currentUser && currentUser.isManager && (
          <Link to="/dashboard?tab=project">
            <Sidebar.Item
               active={tab === "project"}
               icon={HiDocumentText}
               as="div"
             >
               Projects
             </Sidebar.Item>
           </Link>
         )}
          {currentUser && currentUser.isManager && (
          <Link to="/dashboard?tab=post_activity">
            <Sidebar.Item
               active={tab === "post_activity"}
               icon={HiPlus}
               as="div"
             >
               Post Activity
             </Sidebar.Item>
           </Link>
         )}
          {currentUser && currentUser.isSupplier && (
          <Link to="/dashboard?tab=projects">
          <Sidebar.Item
            active={tab === "projects"}
            icon={HiEmojiHappy}
            as="div"
          >
            MyPayment
          </Sidebar.Item>
          </Link>
          )}
          {currentUser && currentUser.isSupplier && (
          <Link to="/dashboard?tab=myapplication">
          <Sidebar.Item
            active={tab === "myapplication"}
            icon={MdKeyboardArrowDown}
            as="div"
          >
            MyApplications
          </Sidebar.Item>
          </Link>
          )}
          {currentUser && currentUser.isSupplier && (
          <Link to="/dashboard?tab=approve">
          <Sidebar.Item
            active={tab === "approve"}
            icon={MdOutlineKeyboardArrowUp}
            as="div"
          >
            Apply for project
          </Sidebar.Item>
          </Link>
          )}
          {currentUser && currentUser.isFinance && (
          <Link to="/dashboard?tab=buy">
          <Sidebar.Item
            active={tab === "buy"}
            icon={MdOutlineKeyboardDoubleArrowDown}
            as="div"
          >
            Buy
          </Sidebar.Item>
          </Link>
          )}
          {currentUser && currentUser.isFinance && (
          <Link to="/dashboard?tab=audit">
          <Sidebar.Item
            active={tab === "audit"}
            icon={MdOutlineKeyboardArrowUp}
            as="div"
          >
            Audit
          </Sidebar.Item>
          </Link>
          )}
          {currentUser && currentUser.isEmployee && (
          <Link to="/dashboard?tab=task">
          <Sidebar.Item
            active={tab === "task"}
            icon={MdOutlineKeyboardArrowRight}
            as="div"
          >
            My Tasks
          </Sidebar.Item>
          </Link>
          
          )}
          {currentUser && currentUser.isEmployee && (
            <Link to="/dashboard?tab=notif">
            <Sidebar.Item
              active={tab === "notif"}
              icon={HiBell}
              as="div"
            >
              Notifications
            </Sidebar.Item>
          </Link>
          )}
          {currentUser.isAdmin && (
            <Link to="/dashboard?tab=projects">
              <Sidebar.Item
                active={tab === "projects"}
                icon={HiDocumentText}
                as="div"
              >
                Projects
              </Sidebar.Item>
            </Link>
          )}
          {currentUser.isAdmin && (
            <>
              <Link to="/dashboard?tab=users">
                <Sidebar.Item
                  active={tab === "users"}
                  icon={HiOutlineUserGroup}
                  as="div"
                >
                  Users
                </Sidebar.Item>
              </Link>
              <Link to="/dashboard?tab=comments">
                <Sidebar.Item
                  active={tab === "comments"}
                  icon={HiAnnotation}
                  as="div"
                >
                  Comments
                </Sidebar.Item>
              </Link>
              <Link to="/dashboard?tab=create-budget">
                <Sidebar.Item
                  active={tab === "create-budget"}
                  icon={HiOutlineThumbDown}
                  pill
                  as="div"
                >
                  Allocate Budget
                </Sidebar.Item>
              </Link>

              <Link to="/dashboard?tab=approve-supplier">
                <Sidebar.Item
                  active={tab === "approve-supplier"}
                  icon={HiEmojiHappy}
                  as="div"
                >
                  Approve Supplier
                </Sidebar.Item>
              </Link>
              <Link to="/dashboard?tab=see_report">
                <Sidebar.Item
                  active={tab === "see_report"}
                  icon={HiOutlineBadgeCheck}
                  as="div"
                >
                  See Report
                </Sidebar.Item>
              </Link>
              <Link to="/dashboard?tab=create-expense">
                <Sidebar.Item
                  active={tab === "create-expense"}
                  icon={HiEmojiHappy}
                  as="div"
                >
                  Approve Payment
                </Sidebar.Item>
              </Link>
            </>
          )}
          <Sidebar.Item

            icon={HiArrowSmRight}
            className="cursor-pointer"
            onClick={handleSignout}
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
