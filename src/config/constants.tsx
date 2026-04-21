import type { ScheduleAppointment, MidwifeType, TimetableConfig } from "@/types"
import { LayoutDashboard, LogOut, PackagePlus, PieChart, Users } from "lucide-react"
import avatar from "@/assets/Avatar.png"

export const SIDE_PANEL_COMPS = [
  {
    icon: <PieChart />,
    text: "Dashboard",
    permissions: ["superuser", "salesperson"],
  },
  {
    icon: <Users />,
    text: "Sales Person",
    permissions: ["superuser"],
  },
  {
    icon: <PackagePlus size={20} />,
    text: "Project A",
    // "Customers",
    subTabs: ["Midwife", "Leads", "Customers", "PreBirth Approvals", "PostBirth Approvals"],
    permissions: ["superuser"],
  },
  {
    icon: <PackagePlus size={20} />,
    text: "Project B",
    permissions: ["superuser"],
  },
  {
    icon: <LayoutDashboard size={20} />,
    text: "Appointments",
    subTabs: ["Upcoming", "Previous", "Settings"],
    permissions: ["superuser", "salesperson"],
  },
  {
    icon: <LogOut size={20} />,
    text: "Logout",
    permissions: ["superuser", "salesperson"],
  },
];

export const INITIAL_AVAILABILITY_DATA: ScheduleAppointment[] = [
  {
    day: "Monday",
    startHour: "08:00 AM",
    endHour: "05:00 PM",
    repeats: "Weekly",
    offDay: true,
    unavailableSlots: [],
  },
  {
    day: "Tuesday",
    startHour: "08:00 AM",
    endHour: "05:00 PM",
    repeats: "Weekly",
    offDay: true,
    unavailableSlots: [],
  },
  {
    day: "Wednesday",
    startHour: "08:00 AM",
    endHour: "05:00 PM",
    repeats: "Weekly",
    offDay: true,
    unavailableSlots: [],
  },
  {
    day: "Thursday",
    startHour: "08:00 AM",
    endHour: "05:00 PM",
    repeats: "Weekly",
    offDay: true,
    unavailableSlots: [],
  },
  {
    day: "Friday",
    startHour: "08:00 AM",
    endHour: "05:00 PM",
    repeats: "Weekly",
    offDay: true,
    unavailableSlots: [],
  },
  {
    day: "Saturday",
    startHour: "08:00 AM",
    endHour: "05:00 PM",
    repeats: "Weekly",
    offDay: true,
    unavailableSlots: [],
  },
  {
    day: "Sunday",
    startHour: "08:00 AM",
    endHour: "05:00 PM",
    repeats: "Weekly",
    offDay: true,
    unavailableSlots: [],
  },
];

export const MIDWIVES_DATA = [
  {
    id: 1,
    name: "Midwife Name",
    location: "Location Here",
    serviceRadius: "15 km",
    activeClients: 30,
    status: "Active",
    image: avatar.src,
  },
  {
    id: 2,
    name: "Name of Midwife @123445",
    location: "Location Here",
    serviceRadius: "17 km",
    activeClients: 20,
    status: "Active",
    image: avatar.src,
  },
  {
    id: 3,
    name: "Name of Midwife @123445",
    location: "Location Here",
    serviceRadius: "17 km",
    activeClients: 100,
    status: "Active",
    image: avatar.src,
  },
  {
    id: 4,
    name: "Name of Midwife @123445",
    location: "Location Here",
    serviceRadius: "17 km",
    activeClients: 250,
    status: "Active",
    image: avatar.src,
  },
  {
    id: 5,
    name: "Name of Midwife @123445",
    location: "Location Here",
    serviceRadius: "17 km",
    activeClients: 50,
    status: "Active",
    image: avatar.src,
  },
  {
    id: 6,
    name: "Name of Midwife @123445",
    location: "Location Here",
    serviceRadius: "18 km",
    activeClients: 13,
    status: "Active",
    image: avatar.src,
  },
  {
    id: 7,
    name: "Name of Midwife @123445",
    location: "Location Here",
    serviceRadius: "18 km",
    activeClients: 10,
    status: "Inactive",
    image: avatar.src,
  },
]

// midwifes Types 
export const MIDWIFE_TYPES: MidwifeType[] = [
  {
    id: "essential",
    title: "ESSENTIAL",
    description: "Basic Services",
    features: [
      "Prebirth Consultation",
      "After Birth Intense Care",
      "After Birth Child",
      "Support"
    ],
    hasSubCategories: false
  },
  {
    id: "advanced",
    title: "ADVANCED",
    description: "Basic services + Private Services",
    features: [
      "Prebirth Consultation",
      "After Birth Intense Care",
      "After Birth Child",
      "Support",
      "Private Services"
    ],
    hasSubCategories: true,
    subCategories: ["private-services"]
  },
  {
    id: "pro",
    title: "PRO",
    description: "Basic Services + Courses/Classes",
    features: [
      "Prebirth Consultation",
      "After Birth Intense Care",
      "After Birth Child",
      "Support",
      "Courses/Classes",
      "Birth Training Class",
      "Birth Training Video"
    ],
    hasSubCategories: true,
    subCategories: ["courses-classes"]
  },
  {
    id: "ultimate",
    title: "ULTIMATE",
    description: "Basic Services + Courses + Private Service",
    features: [
      "Prebirth Consultation",
      "After Birth Intense Care",
      "After Birth Child",
      "Support",
      "Course + Private Service",
      "Birth Training Class",
      "Birth Training Video"
    ],
    hasSubCategories: true,
    subCategories: ["private-services", "courses-classes"]
  },
  {
    id: "remote",
    title: "REMOTE",
    description: "ESSENTIAL OR PRO",
    features: [
      "Prebirth Consultation (online)",
      "After Birth Intense Care (online)",
      "After Birth Child (in persone)",
      "Support (online)",
      "Courses/Classes"
    ],
    hasSubCategories: true,
    subCategories: ["courses-classes"]
  }
];


// midwifes Services 
// export const MIDWIFE_SERVICES: MidwifeService[] = [
//   {
//     serviceTitle: "private-services",
//     // title: "Private Services",
//     selectedItems: [
//       { name: "Baby Massage", tagline: "Baby Massage", type: "private-service", duration: "60 min", appointments: "1", turnover: "80,45€" },
//       { name: "Acupuncture", tagline: "Acupuncture", type: "private-service", duration: "60 min", appointments: "1", turnover: "80,45€" },
//       { name: "Laser Therapy", tagline: "Laser Therapy", type: "private-service", duration: "60 min", appointments: "1", turnover: "80,45€" },
//       { name: "Private service Name", tagline: "Private service Name", type: "private-service", duration: "60 min", appointments: "1", turnover: "80,45€" },
//     ]
//   },
//   {
//     serviceTitle: "courses-classes",
//     // title: "Courses/Classes",
//     selectedItems: [
//       { name: "Birth Prep Class", tagline: "Birth Prep Class", type: "course", duration: "60 min", appointments: "1", turnover: "80,45€" },
//       { name: "After Birth Gym Class", tagline: "After Birth Gym Class", type: "course", duration: "60 min", appointments: "1", turnover: "80,45€" },
//       { name: "Class Name", tagline: "Class Name", type: "course", duration: "60 min", appointments: "1", turnover: "80,45€" },
//       { name: "Course Name", tagline: "Course Name", type: "course", duration: "60 min", appointments: "1", turnover: "80,45€" },
//     ]
//   }
// ];


//  name: string;
//     tagline: string;
//     type: string;
//     duration: string;
//     appointments: string;
//     turnover: string;

//intensity Tab timetable   initialTimeTable

export const INITAIL_TIMETABLE: TimetableConfig = {
  "ESSENTIAL": {
    "2": {
      "weeklyHours": 15,
      "monthlyTurnover": 3300,
      "totalSlots": 55,
      "defaultTimeTable": {
        "Monday": {
          "slots": {
            "A1/A2": [
              { "startTime": "12:00", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:30" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "B2": [
              { "startTime": "12:00", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:30" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "C2": [
              { "startTime": "12:00", "endTime": "12:25" },
              { "startTime": "12:25", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:15" },
              { "startTime": "13:15", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:05" },
              { "startTime": "14:05", "endTime": "14:30" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "D2": [
              { "startTime": "12:00", "endTime": "12:25" },
              { "startTime": "12:25", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:15" },
              { "startTime": "13:15", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:05" },
              { "startTime": "14:05", "endTime": "14:30" }
            ],
            "G": [
              { "startTime": "12:00", "endTime": "12:25" },
              { "startTime": "12:25", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:15" },
              { "startTime": "13:15", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:05" },
              { "startTime": "14:05", "endTime": "14:30" }
            ],
            // "H": []
          }
        },
        "Tuesday": {
          "slots": {
            "A1/A2": [
              { "startTime": "12:00", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:30" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "B2": [
              { "startTime": "12:00", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:30" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "C2": [
              { "startTime": "12:00", "endTime": "12:25" },
              { "startTime": "12:25", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:15" },
              { "startTime": "13:15", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:05" },
              { "startTime": "14:05", "endTime": "14:30" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "D2": [
              { "startTime": "12:00", "endTime": "12:25" },
              { "startTime": "12:25", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:15" },
              { "startTime": "13:15", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:05" },
              { "startTime": "14:05", "endTime": "14:30" }
            ],
            "G": [
              { "startTime": "12:00", "endTime": "12:25" },
              { "startTime": "12:25", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:15" },
              { "startTime": "13:15", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:05" },
              { "startTime": "14:05", "endTime": "14:30" }
            ],
            // "H": []
          }
        },
        "Wednesday": {
          "slots": {
            "A1/A2": [
              { "startTime": "12:00", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:30" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "B2": [
              { "startTime": "12:00", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:30" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "C2": [
              { "startTime": "12:00", "endTime": "12:25" },
              { "startTime": "12:25", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:15" },
              { "startTime": "13:15", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:05" },
              { "startTime": "14:05", "endTime": "14:30" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "D2": [
              { "startTime": "12:00", "endTime": "12:25" },
              { "startTime": "12:25", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:15" },
              { "startTime": "13:15", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:05" },
              { "startTime": "14:05", "endTime": "14:30" }
            ],
            "G": [
              { "startTime": "12:00", "endTime": "12:25" },
              { "startTime": "12:25", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:15" },
              { "startTime": "13:15", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:05" },
              { "startTime": "14:05", "endTime": "14:30" }
            ],
            // "H": []
          }
        },
        "Thursday": {
          "slots": {
            "A1/A2": [
              { "startTime": "12:00", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:30" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "B2": [
              { "startTime": "12:00", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:30" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "C2": [
              { "startTime": "12:00", "endTime": "12:25" },
              { "startTime": "12:25", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:15" },
              { "startTime": "13:15", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:05" },
              { "startTime": "14:05", "endTime": "14:30" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "D2": [
              { "startTime": "12:00", "endTime": "12:25" },
              { "startTime": "12:25", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:15" },
              { "startTime": "13:15", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:05" },
              { "startTime": "14:05", "endTime": "14:30" }
            ],
            "G": [
              { "startTime": "12:00", "endTime": "12:25" },
              { "startTime": "12:25", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:15" },
              { "startTime": "13:15", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:05" },
              { "startTime": "14:05", "endTime": "14:30" }
            ],
            // "H": []
          }
        },
        "Friday": {
          "slots": {
            "A1/A2": [
              { "startTime": "12:00", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:30" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "B2": [
              { "startTime": "12:00", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:30" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "C2": [
              { "startTime": "12:00", "endTime": "12:25" },
              { "startTime": "12:25", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:15" },
              { "startTime": "13:15", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:05" },
              { "startTime": "14:05", "endTime": "14:30" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "D2": [
              { "startTime": "12:00", "endTime": "12:25" },
              { "startTime": "12:25", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:15" },
              { "startTime": "13:15", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:05" },
              { "startTime": "14:05", "endTime": "14:30" }
            ],
            "G": [
              { "startTime": "12:00", "endTime": "12:25" },
              { "startTime": "12:25", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:15" },
              { "startTime": "13:15", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:05" },
              { "startTime": "14:05", "endTime": "14:30" }
            ],
            // "H": []
          }
        },
        "Saturday": {
          "slots": {
            "A1/A2": [],
            "B1": [],
            "B2": [],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" }
            ],
            "C2": [
              { "startTime": "12:00", "endTime": "12:25" },
              { "startTime": "12:25", "endTime": "12:50" }
            ],
            "D1": [],
            "D2": [],
            "G": [],
            // "H": []
          }
        },
        "Sunday": {
          "slots": {
            "A1/A2": [],
            "B1": [

            ],
            "B2": [

            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" }
            ],
            "C2": [
              { "startTime": "12:00", "endTime": "12:25" },
              { "startTime": "12:25", "endTime": "12:50" }
            ],
            "D1": [],
            "D2": [],
            "G": [],
            // "H": []
          }
        }
      }
    },

    "3": {
      "weeklyHours": 23,
      "monthlyTurnover": 4900,
      "totalSlots": 81,
      "defaultTimeTable": {
        "Monday": {
          "slots": {
            "A1/A2": [
              { "startTime": "13:00", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "16:20" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" }
            ],
            "B2": [
              { "startTime": "13:00", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "16:20" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" }
            ],
            "C2": [
              { "startTime": "13:00", "endTime": "13:25" },
              { "startTime": "13:25", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:15" },
              { "startTime": "14:15", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:05" },
              { "startTime": "15:05", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "15:55" },
              { "startTime": "15:55", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "16:45" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" }
            ],
            "D2": [
              { "startTime": "13:00", "endTime": "13:25" },
              { "startTime": "13:25", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:15" },
              { "startTime": "14:15", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:05" },
              { "startTime": "15:05", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "15:55" },
              { "startTime": "15:55", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "16:45" }
            ],
            "G": [
              { "startTime": "13:00", "endTime": "13:25" },
              { "startTime": "13:25", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:15" },
              { "startTime": "14:15", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:05" },
              { "startTime": "15:05", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "15:55" },
              { "startTime": "15:55", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "16:45" }
            ],
            // "H": []
          }
        },
        "Tuesday": {
          "slots": {
            "A1/A2": [
              { "startTime": "13:00", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "16:20" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" }
            ],
            "B2": [
              { "startTime": "13:00", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "16:20" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" }
            ],
            "C2": [
              { "startTime": "13:00", "endTime": "13:25" },
              { "startTime": "13:25", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:15" },
              { "startTime": "14:15", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:05" },
              { "startTime": "15:05", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "15:55" },
              { "startTime": "15:55", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "16:45" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" }
            ],
            "D2": [
              { "startTime": "13:00", "endTime": "13:25" },
              { "startTime": "13:25", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:15" },
              { "startTime": "14:15", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:05" },
              { "startTime": "15:05", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "15:55" },
              { "startTime": "15:55", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "16:45" }
            ],
            "G": [
              { "startTime": "13:00", "endTime": "13:25" },
              { "startTime": "13:25", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:15" },
              { "startTime": "14:15", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:05" },
              { "startTime": "15:05", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "15:55" },
              { "startTime": "15:55", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "16:45" }
            ],
            // "H": []
          }
        },
        "Wednesday": {
          "slots": {
            "A1/A2": [
              { "startTime": "13:00", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "16:20" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" }
            ],
            "B2": [
              { "startTime": "13:00", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "16:20" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" }
            ],
            "C2": [
              { "startTime": "13:00", "endTime": "13:25" },
              { "startTime": "13:25", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:15" },
              { "startTime": "14:15", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:05" },
              { "startTime": "15:05", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "15:55" },
              { "startTime": "15:55", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "16:45" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" }
            ],
            "D2": [
              { "startTime": "13:00", "endTime": "13:25" },
              { "startTime": "13:25", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:15" },
              { "startTime": "14:15", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:05" },
              { "startTime": "15:05", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "15:55" },
              { "startTime": "15:55", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "16:45" }
            ],
            "G": [
              { "startTime": "13:00", "endTime": "13:25" },
              { "startTime": "13:25", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:15" },
              { "startTime": "14:15", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:05" },
              { "startTime": "15:05", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "15:55" },
              { "startTime": "15:55", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "16:45" }
            ],
            // "H": []
          }
        },
        "Thursday": {
          "slots": {
            "A1/A2": [
              { "startTime": "13:00", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "16:20" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" }
            ],
            "B2": [
              { "startTime": "13:00", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "16:20" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" }
            ],
            "C2": [
              { "startTime": "13:00", "endTime": "13:25" },
              { "startTime": "13:25", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:15" },
              { "startTime": "14:15", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:05" },
              { "startTime": "15:05", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "15:55" },
              { "startTime": "15:55", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "16:45" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" }
            ],
            "D2": [
              { "startTime": "13:00", "endTime": "13:25" },
              { "startTime": "13:25", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:15" },
              { "startTime": "14:15", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:05" },
              { "startTime": "15:05", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "15:55" },
              { "startTime": "15:55", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "16:45" }
            ],
            "G": [
              { "startTime": "13:00", "endTime": "13:25" },
              { "startTime": "13:25", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:15" },
              { "startTime": "14:15", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:05" },
              { "startTime": "15:05", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "15:55" },
              { "startTime": "15:55", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "16:45" }
            ],
            // "H": []
          }
        },
        "Friday": {
          "slots": {
            "A1/A2": [
              { "startTime": "13:00", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "16:20" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" }
            ],
            "B2": [
              { "startTime": "13:00", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "16:20" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" }
            ],
            "C2": [
              { "startTime": "13:00", "endTime": "13:25" },
              { "startTime": "13:25", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:15" },
              { "startTime": "14:15", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:05" },
              { "startTime": "15:05", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "15:55" },
              { "startTime": "15:55", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "16:45" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" }
            ],
            "D2": [
              { "startTime": "13:00", "endTime": "13:25" },
              { "startTime": "13:25", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:15" },
              { "startTime": "14:15", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:05" },
              { "startTime": "15:05", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "15:55" },
              { "startTime": "15:55", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "16:45" }
            ],
            "G": [
              { "startTime": "13:00", "endTime": "13:25" },
              { "startTime": "13:25", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:15" },
              { "startTime": "14:15", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:05" },
              { "startTime": "15:05", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "15:55" },
              { "startTime": "15:55", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "16:45" }
            ],
            // "H": []
          }
        },
        "Saturday": {
          "slots": {
            "A1/A2": [],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "B2": [
              { "startTime": "12:00", "endTime": "12:25" },
              { "startTime": "12:25", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:15" }
            ],
            "C1": [],
            "C2": [],
            "D1": [],
            "D2": [],
            "G": [],
            // "H": []
          }
        },
        "Sunday": {
          "slots": {
            "A1/A2": [],
            "B1": [],
            "B2": [],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "C2": [
              { "startTime": "12:00", "endTime": "12:25" },
              { "startTime": "12:25", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:15" }
            ],
            "D1": [],
            "D2": [],
            "G": [],
            // "H": []
          }
        }
      }
    },
    "4": {
      "weeklyHours": 30,
      "monthlyTurnover": 6600,
      "totalSlots": 94,
      "defaultTimeTable": {
        "Monday": {
          "slots": {
            "A1/A2": [
              { "startTime": "14:00", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "19:00" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" }
            ],
            "B2": [
              { "startTime": "14:00", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "19:00" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" }
            ],
            "C2": [
              { "startTime": "14:00", "endTime": "14:25" },
              { "startTime": "14:25", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:15" },
              { "startTime": "15:15", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" },
              { "startTime": "18:35", "endTime": "19:00" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" }
            ],
            "D2": [
              { "startTime": "14:00", "endTime": "14:25" },
              { "startTime": "14:25", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:15" },
              { "startTime": "15:15", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" },
              { "startTime": "18:35", "endTime": "19:00" }
            ],
            "G": [
              { "startTime": "14:00", "endTime": "14:25" },
              { "startTime": "14:25", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:15" },
              { "startTime": "15:15", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" },
              { "startTime": "18:35", "endTime": "19:00" }
            ],
            // "H": []
          }
        },
        "Tuesday": {
          "slots": {
            "A1/A2": [
              { "startTime": "14:00", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "19:00" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" }
            ],
            "B2": [
              { "startTime": "14:00", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "19:00" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" }
            ],
            "C2": [
              { "startTime": "14:00", "endTime": "14:25" },
              { "startTime": "14:25", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:15" },
              { "startTime": "15:15", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" },
              { "startTime": "18:35", "endTime": "19:00" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" }
            ],
            "D2": [
              { "startTime": "14:00", "endTime": "14:25" },
              { "startTime": "14:25", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:15" },
              { "startTime": "15:15", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" },
              { "startTime": "18:35", "endTime": "19:00" }
            ],
            "G": [
              { "startTime": "14:00", "endTime": "14:25" },
              { "startTime": "14:25", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:15" },
              { "startTime": "15:15", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" },
              { "startTime": "18:35", "endTime": "19:00" }
            ],
            // "H": []
          }
        },
        "Wednesday": {
          "slots": {
            "A1/A2": [
              { "startTime": "14:00", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "19:00" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" }
            ],
            "B2": [
              { "startTime": "14:00", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "19:00" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" }
            ],
            "C2": [
              { "startTime": "14:00", "endTime": "14:25" },
              { "startTime": "14:25", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:15" },
              { "startTime": "15:15", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" },
              { "startTime": "18:35", "endTime": "19:00" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" }
            ],
            "D2": [
              { "startTime": "14:00", "endTime": "14:25" },
              { "startTime": "14:25", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:15" },
              { "startTime": "15:15", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" },
              { "startTime": "18:35", "endTime": "19:00" }
            ],
            "G": [
              { "startTime": "14:00", "endTime": "14:25" },
              { "startTime": "14:25", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:15" },
              { "startTime": "15:15", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" },
              { "startTime": "18:35", "endTime": "19:00" }
            ],
            // "H": []
          }
        },
        "Thursday": {
          "slots": {
            "A1/A2": [
              { "startTime": "14:00", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "19:00" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" }
            ],
            "B2": [
              { "startTime": "14:00", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "19:00" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" }
            ],
            "C2": [
              { "startTime": "14:00", "endTime": "14:25" },
              { "startTime": "14:25", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:15" },
              { "startTime": "15:15", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" },
              { "startTime": "18:35", "endTime": "19:00" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" }
            ],
            "D2": [
              { "startTime": "14:00", "endTime": "14:25" },
              { "startTime": "14:25", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:15" },
              { "startTime": "15:15", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" },
              { "startTime": "18:35", "endTime": "19:00" }
            ],
            "G": [
              { "startTime": "14:00", "endTime": "14:25" },
              { "startTime": "14:25", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:15" },
              { "startTime": "15:15", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" },
              { "startTime": "18:35", "endTime": "19:00" }
            ],
            // "H": []
          }
        },
        "Friday": {
          "slots": {
            "A1/A2": [
              { "startTime": "14:00", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "19:00" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" }
            ],
            "B2": [
              { "startTime": "14:00", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "19:00" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" }
            ],
            "C2": [
              { "startTime": "14:00", "endTime": "14:25" },
              { "startTime": "14:25", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:15" },
              { "startTime": "15:15", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" },
              { "startTime": "18:35", "endTime": "19:00" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" }
            ],
            "D2": [
              { "startTime": "14:00", "endTime": "14:25" },
              { "startTime": "14:25", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:15" },
              { "startTime": "15:15", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" },
              { "startTime": "18:35", "endTime": "19:00" }
            ],
            "G": [
              { "startTime": "14:00", "endTime": "14:25" },
              { "startTime": "14:25", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:15" },
              { "startTime": "15:15", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" },
              { "startTime": "18:35", "endTime": "19:00" }
            ],
            // "H": []
          }
        },
        "Saturday": {
          "slots": {
            "A1/A2": [],
            "B1": [],
            "B2": [],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" }
            ],
            "C2": [
              { "startTime": "13:00", "endTime": "13:25" },
              { "startTime": "13:25", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:15" },
              { "startTime": "14:15", "endTime": "14:40" }
            ],
            "D1": [],
            "D2": [],
            "G": [],
            // "H": []
          }
        },
        "Sunday": {
          "slots": {
            "A1/A2": [],
            "B1": [],
            "B2": [],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" }
            ],
            "C2": [
              { "startTime": "13:00", "endTime": "13:25" },
              { "startTime": "13:25", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:15" },
              { "startTime": "14:15", "endTime": "14:40" }
            ],
            "D1": [],
            "D2": [],
            "G": [],
            // "H": []
          }
        }
      }
    },
    "5": {
      "weeklyHours": 38,
      "monthlyTurnover": 8200,
      "totalSlots": 109,
      "defaultTimeTable": {
        "Monday": {
          "slots": {
            "A1/A2": [
              { "startTime": "15:00", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "20:00" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "13:00", "endTime": "14:00" }
            ],
            "B2": [
              { "startTime": "15:00", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "20:00" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "13:00", "endTime": "14:00" }
            ],
            "C2": [
              { "startTime": "15:00", "endTime": "15:25" },
              { "startTime": "15:25", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:15" },
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:00" },
              { "startTime": "20:00", "endTime": "20:25" }
            ],
            // "H": []
          }
        },
        "Tuesday": {
          "slots": {
            "A1/A2": [
              { "startTime": "15:00", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "20:00" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "13:00", "endTime": "14:00" }
            ],
            "B2": [
              { "startTime": "15:00", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "20:00" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "13:00", "endTime": "14:00" }
            ],
            "C2": [
              { "startTime": "15:00", "endTime": "15:25" },
              { "startTime": "15:25", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:15" },
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:00" },
              { "startTime": "20:00", "endTime": "20:25" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "13:00", "endTime": "14:00" }
            ],
            "D2": [
              { "startTime": "15:00", "endTime": "15:25" },
              { "startTime": "15:25", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:15" },
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:00" },
              { "startTime": "20:00", "endTime": "20:25" }
            ],
            "G": [
              { "startTime": "15:00", "endTime": "15:25" },
              { "startTime": "15:25", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:15" },
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:00" },
              { "startTime": "20:00", "endTime": "20:25" }
            ],
            // "H": []
          }
        },
        "Wednesday": {
          "slots": {
            "A1/A2": [
              { "startTime": "15:00", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "20:00" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "13:00", "endTime": "14:00" }
            ],
            "B2": [
              { "startTime": "15:00", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "20:00" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "13:00", "endTime": "14:00" }
            ],
            "C2": [
              { "startTime": "15:00", "endTime": "15:25" },
              { "startTime": "15:25", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:15" },
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:00" },
              { "startTime": "20:00", "endTime": "20:25" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "13:00", "endTime": "14:00" }
            ],
            "D2": [
              { "startTime": "15:00", "endTime": "15:25" },
              { "startTime": "15:25", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:15" },
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:00" },
              { "startTime": "20:00", "endTime": "20:25" }
            ],
            "G": [
              { "startTime": "15:00", "endTime": "15:25" },
              { "startTime": "15:25", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:15" },
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:00" },
              { "startTime": "20:00", "endTime": "20:25" }
            ],
            // "H": []
          }
        },
        "Thursday": {
          "slots": {
            "A1/A2": [
              { "startTime": "15:00", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "20:00" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "13:00", "endTime": "14:00" }
            ],
            "B2": [
              { "startTime": "15:00", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "20:00" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "13:00", "endTime": "14:00" }
            ],
            "C2": [
              { "startTime": "15:00", "endTime": "15:25" },
              { "startTime": "15:25", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:15" },
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:00" },
              { "startTime": "20:00", "endTime": "20:25" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "13:00", "endTime": "14:00" }
            ],
            "D2": [
              { "startTime": "15:00", "endTime": "15:25" },
              { "startTime": "15:25", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:15" },
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:00" },
              { "startTime": "20:00", "endTime": "20:25" }
            ],
            "G": [
              { "startTime": "15:00", "endTime": "15:25" },
              { "startTime": "15:25", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:15" },
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:00" },
              { "startTime": "20:00", "endTime": "20:25" }
            ],
            // "H": []
          }
        },
        "Friday": {
          "slots": {
            "A1/A2": [
              { "startTime": "15:00", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "20:00" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "13:00", "endTime": "14:00" }
            ],
            "B2": [
              { "startTime": "15:00", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "20:00" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "13:00", "endTime": "14:00" }
            ],
            "C2": [
              { "startTime": "15:00", "endTime": "15:25" },
              { "startTime": "15:25", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:15" },
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:00" },
              { "startTime": "20:00", "endTime": "20:25" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "13:00", "endTime": "14:00" }
            ],
            "D2": [
              { "startTime": "15:00", "endTime": "15:25" },
              { "startTime": "15:25", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:15" },
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:00" },
              { "startTime": "20:00", "endTime": "20:25" }
            ],
            "G": [
              { "startTime": "15:00", "endTime": "15:25" },
              { "startTime": "15:25", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:15" },
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:00" },
              { "startTime": "20:00", "endTime": "20:25" }
            ],
            // "H": []
          }
        },
        "Saturday": {
          "slots": {
            "A1/A2": [],
            "B1": [],
            "B2": [],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" }
            ],
            "C2": [
              { "startTime": "14:00", "endTime": "14:25" },
              { "startTime": "14:25", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:15" },
              { "startTime": "15:15", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:30" }
            ],
            "D1": [],
            "D2": [],
            "G": [],
            // "H": []
          }
        },
        "Sunday": {
          "slots": {
            "A1/A2": [],
            "B1": [],
            "B2": [],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" }
            ],
            "C2": [
              { "startTime": "14:00", "endTime": "14:25" },
              { "startTime": "14:25", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:15" },
              { "startTime": "15:15", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:30" }
            ],
            "D1": [],
            "D2": [],
            "G": [],
            // "H": []
          }
        }
      }
    },
    "6": {
      "weeklyHours": 45,
      "monthlyTurnover": 9900,
      "totalSlots": 131,
      "defaultTimeTable": {
        "Monday": {
          "slots": {
            "A1/A2": [
              { "startTime": "16:30", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" },
              { "startTime": "18:35", "endTime": "19:00" },
              { "startTime": "19:00", "endTime": "19:25" },
              { "startTime": "19:25", "endTime": "19:50" },
              { "startTime": "19:50", "endTime": "20:15" },
              { "startTime": "20:15", "endTime": "20:40" },
              { "startTime": "20:40", "endTime": "21:05" },
              { "startTime": "21:05", "endTime": "21:30" },
              { "startTime": "21:30", "endTime": "21:55" },
              { "startTime": "21:55", "endTime": "22:20" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "14:00", "endTime": "15:00" },
              { "startTime": "15:00", "endTime": "16:00" }
            ],
            "D2": [
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" },
              { "startTime": "18:35", "endTime": "19:00" },
              { "startTime": "19:00", "endTime": "19:25" },
              { "startTime": "19:25", "endTime": "19:50" },
              { "startTime": "19:50", "endTime": "20:15" },
              { "startTime": "20:15", "endTime": "20:40" },
              { "startTime": "20:40", "endTime": "21:05" },
              { "startTime": "21:05", "endTime": "21:30" },
              { "startTime": "21:30", "endTime": "21:55" },
              { "startTime": "21:55", "endTime": "22:20" }
            ],
            "G": [
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" },
              { "startTime": "18:35", "endTime": "19:00" },
              { "startTime": "19:00", "endTime": "19:25" },
              { "startTime": "19:25", "endTime": "19:50" },
              { "startTime": "19:50", "endTime": "20:15" },
              { "startTime": "20:15", "endTime": "20:40" },
              { "startTime": "20:40", "endTime": "21:05" },
              { "startTime": "21:05", "endTime": "21:30" },
              { "startTime": "21:30", "endTime": "21:55" },
              { "startTime": "21:55", "endTime": "22:20" }
            ],
            // "H": []
          }
        },
        "Tuesday": {
          "slots": {
            "A1/A2": [
              { "startTime": "16:30", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "19:00" },
              { "startTime": "19:00", "endTime": "19:50" },
              { "startTime": "19:50", "endTime": "20:40" },
              { "startTime": "20:40", "endTime": "21:30" },
              { "startTime": "21:30", "endTime": "22:20" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "14:00", "endTime": "15:00" },
              { "startTime": "15:00", "endTime": "16:00" }
            ],
            "B2": [
              { "startTime": "16:30", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "19:00" },
              { "startTime": "19:00", "endTime": "19:50" },
              { "startTime": "19:50", "endTime": "20:40" },
              { "startTime": "20:40", "endTime": "21:30" },
              { "startTime": "21:30", "endTime": "22:20" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "14:00", "endTime": "15:00" },
              { "startTime": "15:00", "endTime": "16:00" }
            ],
            "C2": [
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" },
              { "startTime": "18:35", "endTime": "19:00" },
              { "startTime": "19:00", "endTime": "19:25" },
              { "startTime": "19:25", "endTime": "19:50" },
              { "startTime": "19:50", "endTime": "20:15" },
              { "startTime": "20:15", "endTime": "20:40" },
              { "startTime": "20:40", "endTime": "21:05" },
              { "startTime": "21:05", "endTime": "21:30" },
              { "startTime": "21:30", "endTime": "21:55" },
              { "startTime": "21:55", "endTime": "22:20" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "14:00", "endTime": "15:00" },
              { "startTime": "15:00", "endTime": "16:00" }
            ],
            "D2": [
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" },
              { "startTime": "18:35", "endTime": "19:00" },
              { "startTime": "19:00", "endTime": "19:25" },
              { "startTime": "19:25", "endTime": "19:50" },
              { "startTime": "19:50", "endTime": "20:15" },
              { "startTime": "20:15", "endTime": "20:40" },
              { "startTime": "20:40", "endTime": "21:05" },
              { "startTime": "21:05", "endTime": "21:30" },
              { "startTime": "21:30", "endTime": "21:55" },
              { "startTime": "21:55", "endTime": "22:20" }
            ],
            "G": [
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" },
              { "startTime": "18:35", "endTime": "19:00" },
              { "startTime": "19:00", "endTime": "19:25" },
              { "startTime": "19:25", "endTime": "19:50" },
              { "startTime": "19:50", "endTime": "20:15" },
              { "startTime": "20:15", "endTime": "20:40" },
              { "startTime": "20:40", "endTime": "21:05" },
              { "startTime": "21:05", "endTime": "21:30" },
              { "startTime": "21:30", "endTime": "21:55" },
              { "startTime": "21:55", "endTime": "22:20" }
            ],
            // "H": []
          }
        },
        "Wednesday": {
          "slots": {
            "A1/A2": [
              { "startTime": "16:30", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "19:00" },
              { "startTime": "19:00", "endTime": "19:50" },
              { "startTime": "19:50", "endTime": "20:40" },
              { "startTime": "20:40", "endTime": "21:30" },
              { "startTime": "21:30", "endTime": "22:20" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "14:00", "endTime": "15:00" },
              { "startTime": "15:00", "endTime": "16:00" }
            ],
            "B2": [
              { "startTime": "16:30", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "19:00" },
              { "startTime": "19:00", "endTime": "19:50" },
              { "startTime": "19:50", "endTime": "20:40" },
              { "startTime": "20:40", "endTime": "21:30" },
              { "startTime": "21:30", "endTime": "22:20" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "14:00", "endTime": "15:00" },
              { "startTime": "15:00", "endTime": "16:00" }
            ],
            "C2": [
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" },
              { "startTime": "18:35", "endTime": "19:00" },
              { "startTime": "19:00", "endTime": "19:25" },
              { "startTime": "19:25", "endTime": "19:50" },
              { "startTime": "19:50", "endTime": "20:15" },
              { "startTime": "20:15", "endTime": "20:40" },
              { "startTime": "20:40", "endTime": "21:05" },
              { "startTime": "21:05", "endTime": "21:30" },
              { "startTime": "21:30", "endTime": "21:55" },
              { "startTime": "21:55", "endTime": "22:20" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "14:00", "endTime": "15:00" },
              { "startTime": "15:00", "endTime": "16:00" }
            ],
            "D2": [
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" },
              { "startTime": "18:35", "endTime": "19:00" },
              { "startTime": "19:00", "endTime": "19:25" },
              { "startTime": "19:25", "endTime": "19:50" },
              { "startTime": "19:50", "endTime": "20:15" },
              { "startTime": "20:15", "endTime": "20:40" },
              { "startTime": "20:40", "endTime": "21:05" },
              { "startTime": "21:05", "endTime": "21:30" },
              { "startTime": "21:30", "endTime": "21:55" },
              { "startTime": "21:55", "endTime": "22:20" }
            ],
            "G": [
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" },
              { "startTime": "18:35", "endTime": "19:00" },
              { "startTime": "19:00", "endTime": "19:25" },
              { "startTime": "19:25", "endTime": "19:50" },
              { "startTime": "19:50", "endTime": "20:15" },
              { "startTime": "20:15", "endTime": "20:40" },
              { "startTime": "20:40", "endTime": "21:05" },
              { "startTime": "21:05", "endTime": "21:30" },
              { "startTime": "21:30", "endTime": "21:55" },
              { "startTime": "21:55", "endTime": "22:20" }
            ],
            // "H": []
          }
        },
        "Thursday": {
          "slots": {
            "A1/A2": [
              { "startTime": "16:30", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "19:00" },
              { "startTime": "19:00", "endTime": "19:50" },
              { "startTime": "19:50", "endTime": "20:40" },
              { "startTime": "20:40", "endTime": "21:30" },
              { "startTime": "21:30", "endTime": "22:20" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "14:00", "endTime": "15:00" },
              { "startTime": "15:00", "endTime": "16:00" }
            ],
            "B2": [
              { "startTime": "16:30", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "19:00" },
              { "startTime": "19:00", "endTime": "19:50" },
              { "startTime": "19:50", "endTime": "20:40" },
              { "startTime": "20:40", "endTime": "21:30" },
              { "startTime": "21:30", "endTime": "22:20" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "14:00", "endTime": "15:00" },
              { "startTime": "15:00", "endTime": "16:00" }
            ],
            "C2": [
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" },
              { "startTime": "18:35", "endTime": "19:00" },
              { "startTime": "19:00", "endTime": "19:25" },
              { "startTime": "19:25", "endTime": "19:50" },
              { "startTime": "19:50", "endTime": "20:15" },
              { "startTime": "20:15", "endTime": "20:40" },
              { "startTime": "20:40", "endTime": "21:05" },
              { "startTime": "21:05", "endTime": "21:30" },
              { "startTime": "21:30", "endTime": "21:55" },
              { "startTime": "21:55", "endTime": "22:20" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "14:00", "endTime": "15:00" },
              { "startTime": "15:00", "endTime": "16:00" }
            ],
            "D2": [
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" },
              { "startTime": "18:35", "endTime": "19:00" },
              { "startTime": "19:00", "endTime": "19:25" },
              { "startTime": "19:25", "endTime": "19:50" },
              { "startTime": "19:50", "endTime": "20:15" },
              { "startTime": "20:15", "endTime": "20:40" },
              { "startTime": "20:40", "endTime": "21:05" },
              { "startTime": "21:05", "endTime": "21:30" },
              { "startTime": "21:30", "endTime": "21:55" },
              { "startTime": "21:55", "endTime": "22:20" }
            ],
            "G": [
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" },
              { "startTime": "18:35", "endTime": "19:00" },
              { "startTime": "19:00", "endTime": "19:25" },
              { "startTime": "19:25", "endTime": "19:50" },
              { "startTime": "19:50", "endTime": "20:15" },
              { "startTime": "20:15", "endTime": "20:40" },
              { "startTime": "20:40", "endTime": "21:05" },
              { "startTime": "21:05", "endTime": "21:30" },
              { "startTime": "21:30", "endTime": "21:55" },
              { "startTime": "21:55", "endTime": "22:20" }
            ],
            // "H": []
          }
        },
        "Friday": {
          "slots": {
            "A1/A2": [
              { "startTime": "16:30", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "19:00" },
              { "startTime": "19:00", "endTime": "19:50" },
              { "startTime": "19:50", "endTime": "20:40" },
              { "startTime": "20:40", "endTime": "21:30" },
              { "startTime": "21:30", "endTime": "22:20" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "14:00", "endTime": "15:00" },
              { "startTime": "15:00", "endTime": "16:00" }
            ],
            "B2": [
              { "startTime": "16:30", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "19:00" },
              { "startTime": "19:00", "endTime": "19:50" },
              { "startTime": "19:50", "endTime": "20:40" },
              { "startTime": "20:40", "endTime": "21:30" },
              { "startTime": "21:30", "endTime": "22:20" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "14:00", "endTime": "15:00" },
              { "startTime": "15:00", "endTime": "16:00" }
            ],
            "C2": [
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" },
              { "startTime": "18:35", "endTime": "19:00" },
              { "startTime": "19:00", "endTime": "19:25" },
              { "startTime": "19:25", "endTime": "19:50" },
              { "startTime": "19:50", "endTime": "20:15" },
              { "startTime": "20:15", "endTime": "20:40" },
              { "startTime": "20:40", "endTime": "21:05" },
              { "startTime": "21:05", "endTime": "21:30" },
              { "startTime": "21:30", "endTime": "21:55" },
              { "startTime": "21:55", "endTime": "22:20" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "14:00", "endTime": "15:00" },
              { "startTime": "15:00", "endTime": "16:00" }
            ],
            "D2": [
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" },
              { "startTime": "18:35", "endTime": "19:00" },
              { "startTime": "19:00", "endTime": "19:25" },
              { "startTime": "19:25", "endTime": "19:50" },
              { "startTime": "19:50", "endTime": "20:15" },
              { "startTime": "20:15", "endTime": "20:40" },
              { "startTime": "20:40", "endTime": "21:05" },
              { "startTime": "21:05", "endTime": "21:30" },
              { "startTime": "21:30", "endTime": "21:55" },
              { "startTime": "21:55", "endTime": "22:20" }
            ],
            "G": [
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" },
              { "startTime": "18:35", "endTime": "19:00" },
              { "startTime": "19:00", "endTime": "19:25" },
              { "startTime": "19:25", "endTime": "19:50" },
              { "startTime": "19:50", "endTime": "20:15" },
              { "startTime": "20:15", "endTime": "20:40" },
              { "startTime": "20:40", "endTime": "21:05" },
              { "startTime": "21:05", "endTime": "21:30" },
              { "startTime": "21:30", "endTime": "21:55" },
              { "startTime": "21:55", "endTime": "22:20" }
            ],
            // "H": []
          }
        },
        "Saturday": {
          "slots": {
            "A1/A2": [],
            "B1": [],
            "B2": [],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "13:00", "endTime": "14:00" }
            ],
            "C2": [
              { "startTime": "15:00", "endTime": "15:25" },
              { "startTime": "15:25", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:15" },
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" }
            ],
            "D1": [],
            "D2": [],
            "G": [],
            // "H": []
          }
        },
        "Sunday": {
          "slots": {
            "A1/A2": [],
            "B1": [],
            "B2": [],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "13:00", "endTime": "14:00" }
            ],
            "C2": [
              { "startTime": "15:00", "endTime": "15:25" },
              { "startTime": "15:25", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:15" },
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" }
            ],
            "D1": [],
            "D2": [],
            "G": [],
            // "H": []
          }
        }
      }
    }
  },
  "PRO": {
    "2": {
      "weeklyHours": 18,
      "monthlyTurnover": 3700,
      "totalSlots": 59,
      "defaultTimeTable": {
        "Monday": {
          "slots": {
            "A1/A2": [
              { "startTime": "12:00", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:30" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "B2": [
              { "startTime": "12:00", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:30" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "C2": [
              { "startTime": "12:00", "endTime": "12:25" },
              { "startTime": "12:25", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:15" },
              { "startTime": "13:15", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:05" },
              { "startTime": "14:05", "endTime": "14:30" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "D2": [
              { "startTime": "12:00", "endTime": "12:25" },
              { "startTime": "12:25", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:15" },
              { "startTime": "13:15", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:05" },
              { "startTime": "14:05", "endTime": "14:30" }
            ],
            "E1": [],
            "E2": [],
            "F1": [],
            "F2": [],
            "G": [
              { "startTime": "12:00", "endTime": "12:25" },
              { "startTime": "12:25", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:15" },
              { "startTime": "13:15", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:05" },
              { "startTime": "14:05", "endTime": "14:30" }
            ],
            // "H": []
          }
        },
        "Tuesday": {
          "slots": {
            "A1/A2": [
              { "startTime": "12:00", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:30" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "B2": [
              { "startTime": "12:00", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:30" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "C2": [
              { "startTime": "12:00", "endTime": "12:25" },
              { "startTime": "12:25", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:15" },
              { "startTime": "13:15", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:05" },
              { "startTime": "14:05", "endTime": "14:30" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "D2": [
              { "startTime": "12:00", "endTime": "12:25" },
              { "startTime": "12:25", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:15" },
              { "startTime": "13:15", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:05" },
              { "startTime": "14:05", "endTime": "14:30" }
            ],
            "E1": [],
            "E2": [],
            "F1": [],
            "F2": [],
            "G": [
              { "startTime": "12:00", "endTime": "12:25" },
              { "startTime": "12:25", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:15" },
              { "startTime": "13:15", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:05" },
              { "startTime": "14:05", "endTime": "14:30" }
            ],
            // "H": []
          }
        },
        "Wednesday": {
          "slots": {
            "A1/A2": [
              { "startTime": "12:00", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:30" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "B2": [
              { "startTime": "12:00", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:30" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "C2": [
              { "startTime": "12:00", "endTime": "12:25" },
              { "startTime": "12:25", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:15" },
              { "startTime": "13:15", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:05" },
              { "startTime": "14:05", "endTime": "14:30" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "D2": [
              { "startTime": "12:00", "endTime": "12:25" },
              { "startTime": "12:25", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:15" },
              { "startTime": "13:15", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:05" },
              { "startTime": "14:05", "endTime": "14:30" }
            ],
            "E1": [
              { "startTime": "18:00", "endTime": "20:20" }
            ],
            "E2": [
              { "startTime": "18:00", "endTime": "20:20" }
            ],
            "F1": [],
            "F2": [],
            "G": [
              { "startTime": "12:00", "endTime": "12:25" },
              { "startTime": "12:25", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:15" },
              { "startTime": "13:15", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:05" },
              { "startTime": "14:05", "endTime": "14:30" }
            ],
            // "H": []
          }
        },
        "Thursday": {
          "slots": {
            "A1/A2": [
              { "startTime": "12:00", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:30" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "B2": [
              { "startTime": "12:00", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:30" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "C2": [
              { "startTime": "12:00", "endTime": "12:25" },
              { "startTime": "12:25", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:15" },
              { "startTime": "13:15", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:05" },
              { "startTime": "14:05", "endTime": "14:30" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "D2": [
              { "startTime": "12:00", "endTime": "12:25" },
              { "startTime": "12:25", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:15" },
              { "startTime": "13:15", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:05" },
              { "startTime": "14:05", "endTime": "14:30" }
            ],
            "E1": [],
            "E2": [],
            "F1": [],
            "F2": [],
            "G": [
              { "startTime": "12:00", "endTime": "12:25" },
              { "startTime": "12:25", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:15" },
              { "startTime": "13:15", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:05" },
              { "startTime": "14:05", "endTime": "14:30" }
            ],
            // "H": []
          }
        },
        "Friday": {
          "slots": {
            "A1/A2": [
              { "startTime": "12:30", "endTime": "13:20" },
              { "startTime": "13:20", "endTime": "14:10" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" }
            ],
            "B2": [
              { "startTime": "12:30", "endTime": "13:20" },
              { "startTime": "13:20", "endTime": "14:10" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" }
            ],
            "C2": [
              { "startTime": "12:30", "endTime": "12:55" },
              { "startTime": "12:55", "endTime": "13:20" },
              { "startTime": "13:20", "endTime": "13:45" },
              { "startTime": "13:45", "endTime": "14:10" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" }
            ],
            "D2": [
              { "startTime": "12:30", "endTime": "12:55" },
              { "startTime": "12:55", "endTime": "13:20" },
              { "startTime": "13:20", "endTime": "13:45" },
              { "startTime": "13:45", "endTime": "14:10" }
            ],
            "E1": [],
            "E2": [],
            "F1": [
              { "startTime": "11:00", "endTime": "12:15" }
            ],
            "F2": [
              { "startTime": "11:00", "endTime": "12:15" }
            ],
            "G": [
              { "startTime": "12:30", "endTime": "12:55" },
              { "startTime": "12:55", "endTime": "13:20" },
              { "startTime": "13:20", "endTime": "13:45" },
              { "startTime": "13:45", "endTime": "14:10" }
            ],
            // "H": []
          }
        },
        "Saturday": {
          "slots": {
            "A1/A2": [],
            "B1": [],
            "B2": [],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" }
            ],
            "C2": [
              { "startTime": "12:00", "endTime": "12:25" },
              { "startTime": "12:25", "endTime": "12:50" }
            ],
            "D1": [],
            "D2": [],
            "E1": [],
            "E2": [],
            "F1": [],
            "F2": [],
            "G": [],
            // "H": []
          }
        },
        "Sunday": {
          "slots": {
            "A1/A2": [],
            "B1": [],
            "B2": [],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" }
            ],
            "C2": [
              { "startTime": "12:00", "endTime": "12:25" },
              { "startTime": "12:25", "endTime": "12:50" }
            ],
            "D1": [],
            "D2": [],
            "E1": [],
            "E2": [],
            "F1": [],
            "F2": [],
            "G": [],
            // "H": []
          }
        }
      }
    },
    "3": {
      "weeklyHours": 25,
      "monthlyTurnover": 5500,
      "totalSlots": 85,
      "defaultTimeTable": {
        "Monday": {
          "slots": {
            "A1/A2": [
              { "startTime": "13:00", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "17:10" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" }
            ],
            "B2": [
              { "startTime": "13:00", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "17:10" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" }
            ],
            "C2": [
              { "startTime": "13:00", "endTime": "13:25" },
              { "startTime": "13:25", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:15" },
              { "startTime": "14:15", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:05" },
              { "startTime": "15:05", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "15:55" },
              { "startTime": "15:55", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "16:45" },
              { "startTime": "16:45", "endTime": "17:10" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" }
            ],
            "D2": [
              { "startTime": "13:00", "endTime": "13:25" },
              { "startTime": "13:25", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:15" },
              { "startTime": "14:15", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:05" },
              { "startTime": "15:05", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "15:55" },
              { "startTime": "15:55", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "16:45" },
              { "startTime": "16:45", "endTime": "17:10" }
            ],
            "E1": [],
            "E2": [],
            "F1": [],
            "F2": [],
            "G": [
              { "startTime": "13:00", "endTime": "13:25" },
              { "startTime": "13:25", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:15" },
              { "startTime": "14:15", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:05" },
              { "startTime": "15:05", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "15:55" },
              { "startTime": "15:55", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "16:45" },
              { "startTime": "16:45", "endTime": "17:10" }
            ],
            // "H": []
          }
        },
        "Tuesday": {
          "slots": {
            "A1/A2": [
              { "startTime": "13:00", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "17:10" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" }
            ],
            "B2": [
              { "startTime": "13:00", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "17:10" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" }
            ],
            "C2": [
              { "startTime": "13:00", "endTime": "13:25" },
              { "startTime": "13:25", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:15" },
              { "startTime": "14:15", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:05" },
              { "startTime": "15:05", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "15:55" },
              { "startTime": "15:55", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "16:45" },
              { "startTime": "16:45", "endTime": "17:10" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" }
            ],
            "D2": [
              { "startTime": "13:00", "endTime": "13:25" },
              { "startTime": "13:25", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:15" },
              { "startTime": "14:15", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:05" },
              { "startTime": "15:05", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "15:55" },
              { "startTime": "15:55", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "16:45" },
              { "startTime": "16:45", "endTime": "17:10" }
            ],
            "E1": [],
            "E2": [],
            "F1": [],
            "F2": [],
            "G": [
              { "startTime": "13:00", "endTime": "13:25" },
              { "startTime": "13:25", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:15" },
              { "startTime": "14:15", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:05" },
              { "startTime": "15:05", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "15:55" },
              { "startTime": "15:55", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "16:45" },
              { "startTime": "16:45", "endTime": "17:10" }
            ],
            // "H": []
          }
        },
        "Wednesday": {
          "slots": {
            "A1/A2": [
              { "startTime": "13:00", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "17:10" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" }
            ],
            "B2": [
              { "startTime": "13:00", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "17:10" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" }
            ],
            "C2": [
              { "startTime": "13:00", "endTime": "13:25" },
              { "startTime": "13:25", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:15" },
              { "startTime": "14:15", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:05" },
              { "startTime": "15:05", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "15:55" },
              { "startTime": "15:55", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "16:45" },
              { "startTime": "16:45", "endTime": "17:10" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" }
            ],
            "D2": [
              { "startTime": "13:00", "endTime": "13:25" },
              { "startTime": "13:25", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:15" },
              { "startTime": "14:15", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:05" },
              { "startTime": "15:05", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "15:55" },
              { "startTime": "15:55", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "16:45" },
              { "startTime": "16:45", "endTime": "17:10" }
            ],
            "E1": [
              { "startTime": "18:00", "endTime": "20:20" }
            ],
            "E2": [
              { "startTime": "18:00", "endTime": "20:20" }
            ],
            "F1": [],
            "F2": [],
            "G": [
              { "startTime": "13:00", "endTime": "13:25" },
              { "startTime": "13:25", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:15" },
              { "startTime": "14:15", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:05" },
              { "startTime": "15:05", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "15:55" },
              { "startTime": "15:55", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "16:45" },
              { "startTime": "16:45", "endTime": "17:10" }
            ],
            // "H": []
          }
        },
        "Thursday": {
          "slots": {
            "A1/A2": [
              { "startTime": "13:00", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "17:10" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" }
            ],
            "B2": [
              { "startTime": "13:00", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "17:10" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" }
            ],
            "C2": [
              { "startTime": "13:00", "endTime": "13:25" },
              { "startTime": "13:25", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:15" },
              { "startTime": "14:15", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:05" },
              { "startTime": "15:05", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "15:55" },
              { "startTime": "15:55", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "16:45" },
              { "startTime": "16:45", "endTime": "17:10" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" }
            ],
            "D2": [
              { "startTime": "13:00", "endTime": "13:25" },
              { "startTime": "13:25", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:15" },
              { "startTime": "14:15", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:05" },
              { "startTime": "15:05", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "15:55" },
              { "startTime": "15:55", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "16:45" },
              { "startTime": "16:45", "endTime": "17:10" }
            ],
            "E1": [],
            "E2": [],
            "F1": [],
            "F2": [],
            "G": [
              { "startTime": "13:00", "endTime": "13:25" },
              { "startTime": "13:25", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:15" },
              { "startTime": "14:15", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:05" },
              { "startTime": "15:05", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "15:55" },
              { "startTime": "15:55", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "16:45" },
              { "startTime": "16:45", "endTime": "17:10" }
            ],
            // "H": []
          }
        },
        "Friday": {
          "slots": {
            "A1/A2": [
              { "startTime": "13:00", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "17:10" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "B2": [
              { "startTime": "13:00", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "17:10" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "C2": [
              { "startTime": "13:00", "endTime": "13:25" },
              { "startTime": "13:25", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:15" },
              { "startTime": "14:15", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:05" },
              { "startTime": "15:05", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "15:55" },
              { "startTime": "15:55", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "16:45" },
              { "startTime": "16:45", "endTime": "17:10" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "D2": [
              { "startTime": "13:00", "endTime": "13:25" },
              { "startTime": "13:25", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:15" },
              { "startTime": "14:15", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:05" },
              { "startTime": "15:05", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "15:55" },
              { "startTime": "15:55", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "16:45" },
              { "startTime": "16:45", "endTime": "17:10" }
            ],
            "E1": [],
            "E2": [],
            "F1": [
              { "startTime": "12:00", "endTime": "13:15" }
            ],
            "F2": [
              { "startTime": "12:00", "endTime": "13:15" }
            ],
            "G": [
              { "startTime": "13:00", "endTime": "13:25" },
              { "startTime": "13:25", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:15" },
              { "startTime": "14:15", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:05" },
              { "startTime": "15:05", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "15:55" },
              { "startTime": "15:55", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "16:45" },
              { "startTime": "16:45", "endTime": "17:10" }
            ],
            // "H": []
          }
        },
        "Saturday": {
          "slots": {
            "A1/A2": [],
            "B1": [],
            "B2": [],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "C2": [

              { "startTime": "12:00", "endTime": "12:25" },
              { "startTime": "12:25", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:15" }

            ],
            "D1": [],
            "D2": [],
            "E1": [],
            "E2": [],
            "F1": [],
            "F2": [],
            "G": [],
            // "H": []
          }
        },
        "Sunday": {
          "slots": {
            "A1/A2": [],
            "B1": [],
            "B2": [],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "C2": [
              { "startTime": "12:00", "endTime": "12:25" },
              { "startTime": "12:25", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:15" }
            ],
            "D1": [],
            "D2": [],
            "E1": [],
            "E2": [],
            "F1": [],
            "F2": [],
            "G": [],
            // "H": []
          }
        }
      }
    },
    "4": {
      "weeklyHours": 33,
      "monthlyTurnover": 7400,
      "totalSlots": 98,
      "defaultTimeTable": {
        "Monday": {
          "slots": {
            "A1/A2": [
              { "startTime": "14:00", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "19:00" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" }
            ],
            "B2": [
              { "startTime": "14:00", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "19:00" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" }
            ],
            "C2": [
              { "startTime": "14:00", "endTime": "14:25" },
              { "startTime": "14:25", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:15" },
              { "startTime": "15:15", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" },
              { "startTime": "18:35", "endTime": "19:00" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" }
            ],
            "D2": [
              { "startTime": "14:00", "endTime": "14:25" },
              { "startTime": "14:25", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:15" },
              { "startTime": "15:15", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" },
              { "startTime": "18:35", "endTime": "19:00" }
            ],
            "E1": [],
            "E2": [],
            "F1": [],
            "F2": [],
            "G": [
              { "startTime": "14:00", "endTime": "14:25" },
              { "startTime": "14:25", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:15" },
              { "startTime": "15:15", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" },
              { "startTime": "18:35", "endTime": "19:00" }
            ],
            // "H": []
          }
        },
        "Tuesday": {
          "slots": {
            "A1/A2": [
              { "startTime": "14:00", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "19:00" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" }
            ],
            "B2": [
              { "startTime": "14:00", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "19:00" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" }
            ],
            "C2": [
              { "startTime": "14:00", "endTime": "14:25" },
              { "startTime": "14:25", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:15" },
              { "startTime": "15:15", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" },
              { "startTime": "18:35", "endTime": "19:00" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" }
            ],
            "D2": [
              { "startTime": "14:00", "endTime": "14:25" },
              { "startTime": "14:25", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:15" },
              { "startTime": "15:15", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" },
              { "startTime": "18:35", "endTime": "19:00" }
            ],
            "E1": [],
            "E2": [],
            "F1": [],
            "F2": [],
            "G": [
              { "startTime": "14:00", "endTime": "14:25" },
              { "startTime": "14:25", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:15" },
              { "startTime": "15:15", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" },
              { "startTime": "18:35", "endTime": "19:00" }
            ],
            // "H": []
          }
        },
        "Wednesday": {
          "slots": {
            "A1/A2": [
              { "startTime": "14:00", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "17:20" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" }
            ],
            "B2": [
              { "startTime": "14:00", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "17:20" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" }
            ],
            "C2": [
              { "startTime": "14:00", "endTime": "14:25" },
              { "startTime": "14:25", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:15" },
              { "startTime": "15:15", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" }
            ],
            "D2": [
              { "startTime": "14:00", "endTime": "14:25" },
              { "startTime": "14:25", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:15" },
              { "startTime": "15:15", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" }
            ],
            "E1": [
              { "startTime": "18:00", "endTime": "20:20" }
            ],
            "E2": [
              { "startTime": "18:00", "endTime": "20:20" }
            ],
            "F1": [],
            "F2": [],
            "G": [
              { "startTime": "14:00", "endTime": "14:25" },
              { "startTime": "14:25", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:15" },
              { "startTime": "15:15", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" }
            ],
            // "H": []
          }
        },
        "Thursday": {
          "slots": {
            "A1/A2": [
              { "startTime": "14:00", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "19:00" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" }
            ],
            "B2": [
              { "startTime": "14:00", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "19:00" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" }
            ],
            "C2": [
              { "startTime": "14:00", "endTime": "14:25" },
              { "startTime": "14:25", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:15" },
              { "startTime": "15:15", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" },
              { "startTime": "18:35", "endTime": "19:00" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" }
            ],
            "D2": [
              { "startTime": "14:00", "endTime": "14:25" },
              { "startTime": "14:25", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:15" },
              { "startTime": "15:15", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" },
              { "startTime": "18:35", "endTime": "19:00" }
            ],
            "E1": [],
            "E2": [],
            "F1": [],
            "F2": [],
            "G": [
              { "startTime": "14:00", "endTime": "14:25" },
              { "startTime": "14:25", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:15" },
              { "startTime": "15:15", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" },
              { "startTime": "18:35", "endTime": "19:00" }
            ],
            // "H": []
          }
        },
        "Friday": {
          "slots": {
            "A1/A2": [
              { "startTime": "13:30", "endTime": "14:20" },
              { "startTime": "14:20", "endTime": "15:10" },
              { "startTime": "15:10", "endTime": "16:00" },
              { "startTime": "16:00", "endTime": "16:50" },
              { "startTime": "16:50", "endTime": "17:40" },
              { "startTime": "17:40", "endTime": "18:30" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "B2": [
              { "startTime": "13:30", "endTime": "14:20" },
              { "startTime": "14:20", "endTime": "15:10" },
              { "startTime": "15:10", "endTime": "16:00" },
              { "startTime": "16:00", "endTime": "16:50" },
              { "startTime": "16:50", "endTime": "17:40" },
              { "startTime": "17:40", "endTime": "18:30" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "C2": [
              { "startTime": "13:30", "endTime": "13:55" },
              { "startTime": "13:55", "endTime": "14:20" },
              { "startTime": "14:20", "endTime": "14:45" },
              { "startTime": "14:45", "endTime": "15:10" },
              { "startTime": "15:10", "endTime": "15:35" },
              { "startTime": "15:35", "endTime": "16:00" },
              { "startTime": "16:00", "endTime": "16:25" },
              { "startTime": "16:25", "endTime": "16:50" },
              { "startTime": "16:50", "endTime": "17:15" },
              { "startTime": "17:15", "endTime": "17:40" },
              { "startTime": "17:40", "endTime": "18:05" },
              { "startTime": "18:05", "endTime": "18:30" },
              { "startTime": "18:30", "endTime": "18:55" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "D2": [
              { "startTime": "13:30", "endTime": "13:55" },
              { "startTime": "13:55", "endTime": "14:20" },
              { "startTime": "14:20", "endTime": "14:45" },
              { "startTime": "14:45", "endTime": "15:10" },
              { "startTime": "15:10", "endTime": "15:35" },
              { "startTime": "15:35", "endTime": "16:00" },
              { "startTime": "16:00", "endTime": "16:25" },
              { "startTime": "16:25", "endTime": "16:50" },
              { "startTime": "16:50", "endTime": "17:15" },
              { "startTime": "17:15", "endTime": "17:40" },
              { "startTime": "17:40", "endTime": "18:05" },
              { "startTime": "18:05", "endTime": "18:30" },
              { "startTime": "18:30", "endTime": "18:55" }
            ],
            "E1": [],
            "E2": [],
            "F1": [
              { "startTime": "12:00", "endTime": "13:15" }
            ],
            "F2": [
              { "startTime": "12:00", "endTime": "13:15" }
            ],
            "G": [
              { "startTime": "13:30", "endTime": "13:55" },
              { "startTime": "13:55", "endTime": "14:20" },
              { "startTime": "14:20", "endTime": "14:45" },
              { "startTime": "14:45", "endTime": "15:10" },
              { "startTime": "15:10", "endTime": "15:35" },
              { "startTime": "15:35", "endTime": "16:00" },
              { "startTime": "16:00", "endTime": "16:25" },
              { "startTime": "16:25", "endTime": "16:50" },
              { "startTime": "16:50", "endTime": "17:15" },
              { "startTime": "17:15", "endTime": "17:40" },
              { "startTime": "17:40", "endTime": "18:05" },
              { "startTime": "18:05", "endTime": "18:30" },
              { "startTime": "18:30", "endTime": "18:55" }
            ],
            // "H": []
          }
        },
        "Saturday": {
          "slots": {
            "A1/A2": [],
            "B1": [],
            "B2": [],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" }
            ],
            "C2": [
              { "startTime": "13:00", "endTime": "13:25" },
              { "startTime": "13:25", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:15" },
              { "startTime": "14:15", "endTime": "14:40" }
            ],
            "D1": [],
            "D2": [],
            "E1": [],
            "E2": [],
            "F1": [],
            "F2": [],
            "G": [],
            // "H": []
          }
        },
        "Sunday": {
          "slots": {
            "A1/A2": [],
            "B1": [],
            "B2": [],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" }
            ],
            "C2": [
              { "startTime": "13:00", "endTime": "13:25" },
              { "startTime": "13:25", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:15" },
              { "startTime": "14:15", "endTime": "14:40" }
            ],
            "D1": [],
            "D2": [],
            "E1": [],
            "E2": [],
            "F1": [],
            "F2": [],
            "G": [],
            // "H": []
          }
        }
      }
    },
    "5": {
      "weeklyHours": 40,
      "monthlyTurnover": 9200,
      "totalSlots": 113,
      "defaultTimeTable": {
        "Monday": {
          "slots": {
            "A1/A2": [
              { "startTime": "15:00", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "20:00" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "13:00", "endTime": "14:00" }
            ],
            "B2": [
              { "startTime": "15:00", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "20:00" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "13:00", "endTime": "14:00" }
            ],
            "C2": [
              { "startTime": "15:00", "endTime": "15:25" },
              { "startTime": "15:25", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:15" },
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:00" },
              { "startTime": "20:00", "endTime": "20:25" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "13:00", "endTime": "14:00" }
            ],
            "D2": [
              { "startTime": "15:00", "endTime": "15:25" },
              { "startTime": "15:25", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:15" },
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:00" },
              { "startTime": "20:00", "endTime": "20:25" }
            ],
            "E1": [],
            "E2": [],
            "F1": [],
            "F2": [],
            "G": [
              { "startTime": "15:00", "endTime": "15:25" },
              { "startTime": "15:25", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:15" },
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:00" },
              { "startTime": "20:00", "endTime": "20:25" }
            ],
            // "H": []
          }
        },
        "Tuesday": {
          "slots": {
            "A1/A2": [
              { "startTime": "15:00", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "20:00" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "13:00", "endTime": "14:00" }
            ],
            "B2": [
              { "startTime": "15:00", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "20:00" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "13:00", "endTime": "14:00" }
            ],
            "C2": [
              { "startTime": "15:00", "endTime": "15:25" },
              { "startTime": "15:25", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:15" },
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:00" },
              { "startTime": "20:00", "endTime": "20:25" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "13:00", "endTime": "14:00" }
            ],
            "D2": [
              { "startTime": "15:00", "endTime": "15:25" },
              { "startTime": "15:25", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:15" },
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:00" },
              { "startTime": "20:00", "endTime": "20:25" }
            ],
            "E1": [],
            "E2": [],
            "F1": [],
            "F2": [],
            "G": [
              { "startTime": "15:00", "endTime": "15:25" },
              { "startTime": "15:25", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:15" },
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:00" },
              { "startTime": "20:00", "endTime": "20:25" }
            ],
            // "H": []
          }
        },
        "Wednesday": {
          "slots": {
            "A1/A2": [
              { "startTime": "15:00", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:30" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "13:00", "endTime": "14:00" }
            ],
            "B2": [
              { "startTime": "15:00", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:30" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "13:00", "endTime": "14:00" }
            ],
            "C2": [
              { "startTime": "15:00", "endTime": "15:25" },
              { "startTime": "15:25", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:15" },
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "13:00", "endTime": "14:00" }
            ],
            "D2": [
              { "startTime": "15:00", "endTime": "15:25" },
              { "startTime": "15:25", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:15" },
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" }
            ],
            "E1": [
              { "startTime": "19:00", "endTime": "21:20" }
            ],
            "E2": [
              { "startTime": "19:00", "endTime": "21:20" }
            ],
            "F1": [],
            "F2": [],
            "G": [
              { "startTime": "15:00", "endTime": "15:25" },
              { "startTime": "15:25", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:15" },
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" }
            ],
            // "H": []
          }
        },
        "Thursday": {
          "slots": {
            "A1/A2": [
              { "startTime": "15:00", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "20:00" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "13:00", "endTime": "14:00" }
            ],
            "B2": [
              { "startTime": "15:00", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "20:00" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "13:00", "endTime": "14:00" }
            ],
            "C2": [
              { "startTime": "15:00", "endTime": "15:25" },
              { "startTime": "15:25", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:15" },
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:00" },
              { "startTime": "20:00", "endTime": "20:25" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "13:00", "endTime": "14:00" }
            ],
            "D2": [
              { "startTime": "15:00", "endTime": "15:25" },
              { "startTime": "15:25", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:15" },
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:00" },
              { "startTime": "20:00", "endTime": "20:25" }
            ],
            "E1": [],
            "E2": [],
            "F1": [],
            "F2": [],
            "G": [
              { "startTime": "15:00", "endTime": "15:25" },
              { "startTime": "15:25", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:15" },
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:00" },
              { "startTime": "20:00", "endTime": "20:25" }
            ],
            // "H": []
          }
        },
        "Friday": {
          "slots": {
            "A1/A2": [
              { "startTime": "14:30", "endTime": "15:20" },
              { "startTime": "15:20", "endTime": "16:10" },
              { "startTime": "16:10", "endTime": "17:00" },
              { "startTime": "17:00", "endTime": "17:50" },
              { "startTime": "17:50", "endTime": "18:40" },
              { "startTime": "18:40", "endTime": "19:30" },
              { "startTime": "19:30", "endTime": "20:20" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" }
            ],
            "B2": [
              { "startTime": "14:30", "endTime": "15:20" },
              { "startTime": "15:20", "endTime": "16:10" },
              { "startTime": "16:10", "endTime": "17:00" },
              { "startTime": "17:00", "endTime": "17:50" },
              { "startTime": "17:50", "endTime": "18:40" },
              { "startTime": "18:40", "endTime": "19:30" },
              { "startTime": "19:30", "endTime": "20:20" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" }
            ],
            "C2": [
              { "startTime": "14:30", "endTime": "14:55" },
              { "startTime": "14:55", "endTime": "15:20" },
              { "startTime": "15:20", "endTime": "15:45" },
              { "startTime": "15:45", "endTime": "16:10" },
              { "startTime": "16:10", "endTime": "16:35" },
              { "startTime": "16:35", "endTime": "17:00" },
              { "startTime": "17:00", "endTime": "17:25" },
              { "startTime": "17:25", "endTime": "17:50" },
              { "startTime": "17:50", "endTime": "18:15" },
              { "startTime": "18:15", "endTime": "18:40" },
              { "startTime": "18:40", "endTime": "19:05" },
              { "startTime": "19:05", "endTime": "19:30" },
              { "startTime": "19:30", "endTime": "19:55" },
              { "startTime": "19:55", "endTime": "20:20" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" }
            ],
            "D2": [
              { "startTime": "14:30", "endTime": "14:55" },
              { "startTime": "14:55", "endTime": "15:20" },
              { "startTime": "15:20", "endTime": "15:45" },
              { "startTime": "15:45", "endTime": "16:10" },
              { "startTime": "16:10", "endTime": "16:35" },
              { "startTime": "16:35", "endTime": "17:00" },
              { "startTime": "17:00", "endTime": "17:25" },
              { "startTime": "17:25", "endTime": "17:50" },
              { "startTime": "17:50", "endTime": "18:15" },
              { "startTime": "18:15", "endTime": "18:40" },
              { "startTime": "18:40", "endTime": "19:05" },
              { "startTime": "19:05", "endTime": "19:30" },
              { "startTime": "19:30", "endTime": "19:55" },
              { "startTime": "19:55", "endTime": "20:20" }
            ],
            "E1": [],
            "E2": [],
            "F1": [
              { "startTime": "13:00", "endTime": "14:15" }
            ],
            "F2": [
              { "startTime": "13:00", "endTime": "14:15" }
            ],
            "G": [
              { "startTime": "14:30", "endTime": "14:55" },
              { "startTime": "14:55", "endTime": "15:20" },
              { "startTime": "15:20", "endTime": "15:45" },
              { "startTime": "15:45", "endTime": "16:10" },
              { "startTime": "16:10", "endTime": "16:35" },
              { "startTime": "16:35", "endTime": "17:00" },
              { "startTime": "17:00", "endTime": "17:25" },
              { "startTime": "17:25", "endTime": "17:50" },
              { "startTime": "17:50", "endTime": "18:15" },
              { "startTime": "18:15", "endTime": "18:40" },
              { "startTime": "18:40", "endTime": "19:05" },
              { "startTime": "19:05", "endTime": "19:30" },
              { "startTime": "19:30", "endTime": "19:55" },
              { "startTime": "19:55", "endTime": "20:20" }
            ],
            // "H": []
          }
        },
        "Saturday": {
          "slots": {
            "A1/A2": [],
            "B1": [],
            "B2": [],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" }
            ],
            "C2": [
              { "startTime": "14:00", "endTime": "14:25" },
              { "startTime": "14:25", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:15" },
              { "startTime": "15:15", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:30" }
            ],
            "D1": [],
            "D2": [],
            "E1": [],
            "E2": [],
            "F1": [],
            "F2": [],
            "G": [],
            // "H": []
          }
        },
        "Sunday": {
          "slots": {
            "A1/A2": [],
            "B1": [],
            "B2": [],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" }
            ],
            "C2": [
              { "startTime": "14:00", "endTime": "14:25" },
              { "startTime": "14:25", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:15" },
              { "startTime": "15:15", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:30" }
            ],
            "D1": [],
            "D2": [],
            "E1": [],
            "E2": [],
            "F1": [],
            "F2": [],
            "G": [],
            // "H": []
          }
        }
      }
    },
    "6": {
      "weeklyHours": 45,
      "monthlyTurnover": 11700,
      "totalSlots": 135,
      "defaultTimeTable": {
        "Monday": {
          "slots": {
            "A1/A2": [],
            "B1": [
              { "startTime": "15:00", "endTime": "16:00" }
            ],
            "B2": [
              { "startTime": "16:15", "endTime": "17:00" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "14:00", "endTime": "15:00" }
            ],
            "C2": [
              { "startTime": "18:30", "endTime": "18:55" },
              { "startTime": "18:55", "endTime": "19:20" },
              { "startTime": "19:20", "endTime": "19:45" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "14:00", "endTime": "15:00" }
            ],
            "D2": [
              { "startTime": "17:00", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "18:00" },
              { "startTime": "18:00", "endTime": "18:30" }
            ],
            "E1": [],
            "E2": [],
            "F1": [],
            "F2": [],
            "G": [
              { "startTime": "19:45", "endTime": "20:10" },
              { "startTime": "20:10", "endTime": "20:35" }
            ],
            "H": [
              { "startTime": "20:45", "endTime": "21:45" },
              { "startTime": "21:45", "endTime": "22:45" }
            ]
          }
        },
        "Tuesday": {
          "slots": {
            "A1/A2": [
              { "startTime": "16:30", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "19:00" },
              { "startTime": "19:00", "endTime": "19:50" },
              { "startTime": "19:50", "endTime": "20:40" },
              { "startTime": "20:40", "endTime": "21:30" },
              { "startTime": "21:30", "endTime": "22:20" },
              { "startTime": "22:20", "endTime": "23:10" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "14:00", "endTime": "15:00" },
              { "startTime": "15:00", "endTime": "16:00" }
            ],
            "B2": [
              { "startTime": "16:30", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "19:00" },
              { "startTime": "19:00", "endTime": "19:50" },
              { "startTime": "19:50", "endTime": "20:40" },
              { "startTime": "20:40", "endTime": "21:30" },
              { "startTime": "21:30", "endTime": "22:20" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "14:00", "endTime": "15:00" },
              { "startTime": "15:00", "endTime": "16:00" }
            ],
            "C2": [
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" },
              { "startTime": "18:35", "endTime": "19:00" },
              { "startTime": "19:00", "endTime": "19:25" },
              { "startTime": "19:25", "endTime": "19:50" },
              { "startTime": "19:50", "endTime": "20:15" },
              { "startTime": "20:15", "endTime": "20:40" },
              { "startTime": "20:40", "endTime": "21:05" },
              { "startTime": "21:05", "endTime": "21:30" },
              { "startTime": "21:30", "endTime": "21:55" },
              { "startTime": "21:55", "endTime": "22:20" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "14:00", "endTime": "15:00" },
              { "startTime": "15:00", "endTime": "16:00" }
            ],
            "D2": [
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" },
              { "startTime": "18:35", "endTime": "19:00" },
              { "startTime": "19:00", "endTime": "19:25" },
              { "startTime": "19:25", "endTime": "19:50" },
              { "startTime": "19:50", "endTime": "20:15" },
              { "startTime": "20:15", "endTime": "20:40" },
              { "startTime": "20:40", "endTime": "21:05" },
              { "startTime": "21:05", "endTime": "21:30" },
              { "startTime": "21:30", "endTime": "21:55" },
              { "startTime": "21:55", "endTime": "22:20" }
            ],
            "E1": [],
            "E2": [],
            "F1": [],
            "F2": [],
            "G": [
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" },
              { "startTime": "18:35", "endTime": "19:00" },
              { "startTime": "19:00", "endTime": "19:25" },
              { "startTime": "19:25", "endTime": "19:50" },
              { "startTime": "19:50", "endTime": "20:15" },
              { "startTime": "20:15", "endTime": "20:40" },
              { "startTime": "20:40", "endTime": "21:05" },
              { "startTime": "21:05", "endTime": "21:30" },
              { "startTime": "21:30", "endTime": "21:55" },
              { "startTime": "21:55", "endTime": "22:20" }
            ],
            // "H": []
          }
        },
        "Wednesday": {
          "slots": {
            "A1/A2": [
              { "startTime": "15:30", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "17:10" },
              { "startTime": "17:10", "endTime": "18:00" },
              { "startTime": "22:00", "endTime": "22:50" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "14:00", "endTime": "15:00" }
            ],
            "B2": [
              { "startTime": "15:30", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "17:10" },
              { "startTime": "17:10", "endTime": "18:00" },
              { "startTime": "22:00", "endTime": "22:50" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "14:00", "endTime": "15:00" }
            ],
            "C2": [
              { "startTime": "15:30", "endTime": "15:55" },
              { "startTime": "15:55", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "16:45" },
              { "startTime": "16:45", "endTime": "17:10" },
              { "startTime": "17:10", "endTime": "17:35" },
              { "startTime": "17:35", "endTime": "18:00" },
              { "startTime": "18:00", "endTime": "18:25" },
              { "startTime": "22:00", "endTime": "22:25" },
              { "startTime": "22:25", "endTime": "22:50" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "14:00", "endTime": "15:00" }
            ],
            "D2": [
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" },
              { "startTime": "18:35", "endTime": "19:00" },
              { "startTime": "19:00", "endTime": "19:25" },
              { "startTime": "19:25", "endTime": "19:50" },
              { "startTime": "19:50", "endTime": "20:15" },
              { "startTime": "20:15", "endTime": "20:40" },
              { "startTime": "20:40", "endTime": "21:05" },
              { "startTime": "21:05", "endTime": "21:30" },
              { "startTime": "21:30", "endTime": "21:55" },
              { "startTime": "21:55", "endTime": "22:20" }
            ],
            "E1": [
              { "startTime": "19:00", "endTime": "21:20" }
            ],
            "E2": [
              { "startTime": "19:00", "endTime": "21:20" }
            ],
            "F1": [],
            "F2": [],
            "G": [
              { "startTime": "15:30", "endTime": "15:55" },
              { "startTime": "15:55", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "16:45" },
              { "startTime": "16:45", "endTime": "17:10" },
              { "startTime": "17:10", "endTime": "17:35" },
              { "startTime": "17:35", "endTime": "18:00" },
              { "startTime": "18:00", "endTime": "18:25" },
              { "startTime": "22:00", "endTime": "22:25" },
              { "startTime": "22:25", "endTime": "22:50" }
            ],
            // "H": []
          }
        },
        "Thursday": {
          "slots": {
            "A1/A2": [
              { "startTime": "15:30", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "17:10" },
              { "startTime": "17:10", "endTime": "18:00" },
              { "startTime": "18:00", "endTime": "18:50" },
              { "startTime": "18:50", "endTime": "19:40" },
              { "startTime": "19:40", "endTime": "20:30" },
              { "startTime": "20:30", "endTime": "21:20" },
              { "startTime": "21:20", "endTime": "22:10" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "14:00", "endTime": "15:00" }
            ],
            "B2": [
              { "startTime": "16:30", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "19:00" },
              { "startTime": "19:00", "endTime": "19:50" },
              { "startTime": "19:50", "endTime": "20:40" },
              { "startTime": "20:40", "endTime": "21:30" },
              { "startTime": "21:30", "endTime": "22:20" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "14:00", "endTime": "15:00" }
            ],
            "C2": [
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" },
              { "startTime": "18:35", "endTime": "19:00" },
              { "startTime": "19:00", "endTime": "19:25" },
              { "startTime": "19:25", "endTime": "19:50" },
              { "startTime": "19:50", "endTime": "20:15" },
              { "startTime": "20:15", "endTime": "20:40" },
              { "startTime": "20:40", "endTime": "21:05" },
              { "startTime": "21:05", "endTime": "21:30" },
              { "startTime": "21:30", "endTime": "21:55" },
              { "startTime": "21:55", "endTime": "22:20" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "14:00", "endTime": "15:00" }
            ],
            "D2": [
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" },
              { "startTime": "18:35", "endTime": "19:00" },
              { "startTime": "19:00", "endTime": "19:25" },
              { "startTime": "19:25", "endTime": "19:50" },
              { "startTime": "19:50", "endTime": "20:15" },
              { "startTime": "20:15", "endTime": "20:40" },
              { "startTime": "20:40", "endTime": "21:05" },
              { "startTime": "21:05", "endTime": "21:30" },
              { "startTime": "21:30", "endTime": "21:55" },
              { "startTime": "21:55", "endTime": "22:20" }
            ],
            "E1": [],
            "E2": [],
            "F1": [],
            "F2": [],
            "G": [
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" },
              { "startTime": "18:35", "endTime": "19:00" },
              { "startTime": "19:00", "endTime": "19:25" },
              { "startTime": "19:25", "endTime": "19:50" },
              { "startTime": "19:50", "endTime": "20:15" },
              { "startTime": "20:15", "endTime": "20:40" },
              { "startTime": "20:40", "endTime": "21:05" },
              { "startTime": "21:05", "endTime": "21:30" },
              { "startTime": "21:30", "endTime": "21:55" },
              { "startTime": "21:55", "endTime": "22:20" }
            ],
            // "H": []
          }
        },
        "Friday": {
          "slots": {
            "A1/A2": [
              { "startTime": "16:45", "endTime": "17:35" },
              { "startTime": "17:35", "endTime": "18:25" },
              { "startTime": "18:25", "endTime": "19:15" },
              { "startTime": "19:15", "endTime": "20:05" },
              { "startTime": "20:05", "endTime": "20:55" },
              { "startTime": "20:55", "endTime": "21:45" },
              { "startTime": "21:45", "endTime": "22:35" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "13:00", "endTime": "14:00" }
            ],
            "B2": [
              { "startTime": "16:45", "endTime": "17:35" },
              { "startTime": "17:35", "endTime": "18:25" },
              { "startTime": "18:25", "endTime": "19:15" },
              { "startTime": "19:15", "endTime": "20:05" },
              { "startTime": "20:05", "endTime": "20:55" },
              { "startTime": "20:55", "endTime": "21:45" },
              { "startTime": "21:45", "endTime": "22:35" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "13:00", "endTime": "14:00" }
            ],
            "C2": [
              { "startTime": "16:45", "endTime": "17:10" },
              { "startTime": "17:10", "endTime": "17:35" },
              { "startTime": "17:35", "endTime": "18:00" },
              { "startTime": "18:00", "endTime": "18:25" },
              { "startTime": "18:25", "endTime": "18:50" },
              { "startTime": "18:50", "endTime": "19:15" },
              { "startTime": "19:15", "endTime": "19:40" },
              { "startTime": "19:40", "endTime": "20:05" },
              { "startTime": "20:05", "endTime": "20:30" },
              { "startTime": "20:30", "endTime": "20:55" },
              { "startTime": "20:55", "endTime": "21:20" },
              { "startTime": "21:20", "endTime": "21:45" },
              { "startTime": "21:45", "endTime": "22:10" },
              { "startTime": "22:10", "endTime": "22:35" },
              { "startTime": "22:35", "endTime": "23:00" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "13:00", "endTime": "14:00" }
            ],
            "D2": [
              { "startTime": "16:45", "endTime": "17:10" },
              { "startTime": "17:10", "endTime": "17:35" },
              { "startTime": "17:35", "endTime": "18:00" },
              { "startTime": "18:00", "endTime": "18:25" },
              { "startTime": "18:25", "endTime": "18:50" },
              { "startTime": "18:50", "endTime": "19:15" },
              { "startTime": "19:15", "endTime": "19:40" },
              { "startTime": "19:40", "endTime": "20:05" },
              { "startTime": "20:05", "endTime": "20:30" },
              { "startTime": "20:30", "endTime": "20:55" },
              { "startTime": "20:55", "endTime": "21:20" },
              { "startTime": "21:20", "endTime": "21:45" },
              { "startTime": "21:45", "endTime": "22:10" },
              { "startTime": "22:10", "endTime": "22:35" },
              { "startTime": "22:35", "endTime": "23:00" }
            ],
            "E1": [],
            "E2": [],
            "F1": [
              { "startTime": "15:00", "endTime": "16:10" }
            ],
            "F2": [
              { "startTime": "15:00", "endTime": "16:10" }
            ],
            "G": [
              { "startTime": "16:45", "endTime": "17:10" },
              { "startTime": "17:10", "endTime": "17:35" },
              { "startTime": "17:35", "endTime": "18:00" },
              { "startTime": "18:00", "endTime": "18:25" },
              { "startTime": "18:25", "endTime": "18:50" },
              { "startTime": "18:50", "endTime": "19:15" },
              { "startTime": "19:15", "endTime": "19:40" },
              { "startTime": "19:40", "endTime": "20:05" },
              { "startTime": "20:05", "endTime": "20:30" },
              { "startTime": "20:30", "endTime": "20:55" },
              { "startTime": "20:55", "endTime": "21:20" },
              { "startTime": "21:20", "endTime": "21:45" },
              { "startTime": "21:45", "endTime": "22:10" },
              { "startTime": "22:10", "endTime": "22:35" },
              { "startTime": "22:35", "endTime": "23:00" }
            ],
            // "H": []
          }
        },
        "Saturday": {
          "slots": {
            "A1/A2": [],
            "B1": [],
            "B2": [],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "13:00", "endTime": "14:00" }
            ],
            "C2": [
              { "startTime": "15:00", "endTime": "15:25" },
              { "startTime": "15:25", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:15" },
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" }
            ],
            "D1": [],
            "D2": [],
            "E1": [],
            "E2": [],
            "F1": [],
            "F2": [],
            "G": [],
            // "H": []
          }
        },
        "Sunday": {
          "slots": {
            "A1/A2": [],
            "B1": [],
            "B2": [],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "13:00", "endTime": "14:00" }
            ],
            "C2": [
              { "startTime": "15:00", "endTime": "15:25" },
              { "startTime": "15:25", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:15" },
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" }
            ],
            "D1": [],
            "D2": [],
            "E1": [],
            "E2": [],
            "F1": [],
            "F2": [],
            "G": [],
            // "H": []
          }
        }
      }
    },

  },
  "ADVANCED": {
    "2": {
      "weeklyHours": 16,
      "monthlyTurnover": 3600,
      "totalSlots": 56,
      "defaultTimeTable": {
        "Monday": {
          "slots": {
            "A1/A2": [
              { "startTime": "12:00", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:30" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "B2": [
              { "startTime": "12:00", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:30" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "C2": [
              { "startTime": "12:00", "endTime": "12:25" },
              { "startTime": "12:25", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:15" },
              { "startTime": "13:15", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:05" },
              { "startTime": "14:05", "endTime": "14:30" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "D2": [
              { "startTime": "12:00", "endTime": "12:25" },
              { "startTime": "12:25", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:15" },
              { "startTime": "13:15", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:05" },
              { "startTime": "14:05", "endTime": "14:30" }
            ],
            "I": [],
            "G": [
              { "startTime": "12:00", "endTime": "12:25" },
              { "startTime": "12:25", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:15" },
              { "startTime": "13:15", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:05" },
              { "startTime": "14:05", "endTime": "14:30" }
            ],
            // "H": []
          }
        },
        "Tuesday": {
          "slots": {
            "A1/A2": [
              { "startTime": "12:00", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:30" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "B2": [
              { "startTime": "12:00", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:30" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "C2": [
              { "startTime": "12:00", "endTime": "12:25" },
              { "startTime": "12:25", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:15" },
              { "startTime": "13:15", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:05" },
              { "startTime": "14:05", "endTime": "14:30" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "D2": [
              { "startTime": "12:00", "endTime": "12:25" },
              { "startTime": "12:25", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:15" },
              { "startTime": "13:15", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:05" },
              { "startTime": "14:05", "endTime": "14:30" }
            ],
            "I": [],
            "G": [
              { "startTime": "12:00", "endTime": "12:25" },
              { "startTime": "12:25", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:15" },
              { "startTime": "13:15", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:05" },
              { "startTime": "14:05", "endTime": "14:30" }
            ],
            // "H": []
          }
        },
        "Wednesday": {
          "slots": {
            "A1/A2": [
              { "startTime": "12:00", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:30" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "B2": [
              { "startTime": "12:00", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:30" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "C2": [
              { "startTime": "12:00", "endTime": "12:25" },
              { "startTime": "12:25", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:15" },
              { "startTime": "13:15", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:05" },
              { "startTime": "14:05", "endTime": "14:30" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "D2": [
              { "startTime": "12:00", "endTime": "12:25" },
              { "startTime": "12:25", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:15" },
              { "startTime": "13:15", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:05" },
              { "startTime": "14:05", "endTime": "14:30" }
            ],
            "I": [],
            "G": [
              { "startTime": "12:00", "endTime": "12:25" },
              { "startTime": "12:25", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:15" },
              { "startTime": "13:15", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:05" },
              { "startTime": "14:05", "endTime": "14:30" }
            ],
            // "H": []
          }
        },
        "Thursday": {
          "slots": {
            "A1/A2": [
              { "startTime": "12:00", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:30" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "B2": [
              { "startTime": "12:00", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:30" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "C2": [
              { "startTime": "12:00", "endTime": "12:25" },
              { "startTime": "12:25", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:15" },
              { "startTime": "13:15", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:05" },
              { "startTime": "14:05", "endTime": "14:30" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "D2": [
              { "startTime": "12:00", "endTime": "12:25" },
              { "startTime": "12:25", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:15" },
              { "startTime": "13:15", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:05" },
              { "startTime": "14:05", "endTime": "14:30" }
            ],
            "I": [],
            "G": [
              { "startTime": "12:00", "endTime": "12:25" },
              { "startTime": "12:25", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:15" },
              { "startTime": "13:15", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:05" },
              { "startTime": "14:05", "endTime": "14:30" }
            ],
            // "H": []
          }
        },
        "Friday": {
          "slots": {
            "A1/A2": [
              { "startTime": "12:00", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:30" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" }
            ],
            "B2": [
              { "startTime": "12:00", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:30" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" }
            ],
            "C2": [
              { "startTime": "12:00", "endTime": "12:25" },
              { "startTime": "12:25", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:15" },
              { "startTime": "13:15", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:05" },
              { "startTime": "14:05", "endTime": "14:30" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" }
            ],
            "D2": [
              { "startTime": "12:00", "endTime": "12:25" },
              { "startTime": "12:25", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:15" },
              { "startTime": "13:15", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:05" },
              { "startTime": "14:05", "endTime": "14:30" }
            ],
            "I": [
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "G": [
              { "startTime": "12:00", "endTime": "12:25" },
              { "startTime": "12:25", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:15" },
              { "startTime": "13:15", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:05" },
              { "startTime": "14:05", "endTime": "14:30" }
            ],
            // "H": []
          }
        },
        "Saturday": {
          "slots": {
            "A1/A2": [],
            "B1": [],
            "B2": [],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" }
            ],
            "C2": [
              { "startTime": "12:00", "endTime": "12:25" },
              { "startTime": "12:25", "endTime": "12:50" }
            ],
            "D1": [],
            "D2": [],
            "I": [],
            "G": [],
            // "H": []
          }
        },
        "Sunday": {
          "slots": {
            "A1/A2": [],
            "B1": [],
            "B2": [],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" }
            ],
            "C2": [
              { "startTime": "12:00", "endTime": "12:25" },
              { "startTime": "12:25", "endTime": "12:50" }
            ],
            "D1": [],
            "D2": [],
            "I": [],
            "G": [],
            // "H": []
          }
        }
      }
    },
    "3": {
      "weeklyHours": 24,
      "monthlyTurnover": 5600,
      "totalSlots": 83,

      "defaultTimeTable": {
        "Monday": {
          "slots": {
            "A1/A2": [
              { "startTime": "13:00", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "16:20" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" }
            ],
            "B2": [
              { "startTime": "13:00", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "16:20" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" }
            ],
            "C2": [
              { "startTime": "13:00", "endTime": "13:25" },
              { "startTime": "13:25", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:15" },
              { "startTime": "14:15", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:05" },
              { "startTime": "15:05", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "15:55" },
              { "startTime": "15:55", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "16:45" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" }
            ],
            "D2": [
              { "startTime": "13:00", "endTime": "13:25" },
              { "startTime": "13:25", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:15" },
              { "startTime": "14:15", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:05" },
              { "startTime": "15:05", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "15:55" },
              { "startTime": "15:55", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "16:45" }
            ],
            "I": [],
            "G": [
              { "startTime": "13:00", "endTime": "13:25" },
              { "startTime": "13:25", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:15" },
              { "startTime": "14:15", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:05" },
              { "startTime": "15:05", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "15:55" },
              { "startTime": "15:55", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "16:45" }
            ],
            // "H": []
          }
        },
        "Tuesday": {
          "slots": {
            "A1/A2": [
              { "startTime": "13:00", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "16:20" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" }
            ],
            "B2": [
              { "startTime": "13:00", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "16:20" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" }
            ],
            "C2": [
              { "startTime": "13:00", "endTime": "13:25" },
              { "startTime": "13:25", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:15" },
              { "startTime": "14:15", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:05" },
              { "startTime": "15:05", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "15:55" },
              { "startTime": "15:55", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "16:45" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" }
            ],
            "D2": [
              { "startTime": "13:00", "endTime": "13:25" },
              { "startTime": "13:25", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:15" },
              { "startTime": "14:15", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:05" },
              { "startTime": "15:05", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "15:55" },
              { "startTime": "15:55", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "16:45" }
            ],
            "I": [],
            "G": [
              { "startTime": "13:00", "endTime": "13:25" },
              { "startTime": "13:25", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:15" },
              { "startTime": "14:15", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:05" },
              { "startTime": "15:05", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "15:55" },
              { "startTime": "15:55", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "16:45" }
            ],
            // "H": []
          }
        },
        "Wednesday": {
          "slots": {
            "A1/A2": [
              { "startTime": "13:00", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "16:20" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" }
            ],
            "B2": [
              { "startTime": "13:00", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "16:20" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" }
            ],
            "C2": [
              { "startTime": "13:00", "endTime": "13:25" },
              { "startTime": "13:25", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:15" },
              { "startTime": "14:15", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:05" },
              { "startTime": "15:05", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "15:55" },
              { "startTime": "15:55", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "16:45" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" }
            ],
            "D2": [
              { "startTime": "13:00", "endTime": "13:25" },
              { "startTime": "13:25", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:15" },
              { "startTime": "14:15", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:05" },
              { "startTime": "15:05", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "15:55" },
              { "startTime": "15:55", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "16:45" }
            ],
            "I": [],
            "G": [
              { "startTime": "13:00", "endTime": "13:25" },
              { "startTime": "13:25", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:15" },
              { "startTime": "14:15", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:05" },
              { "startTime": "15:05", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "15:55" },
              { "startTime": "15:55", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "16:45" }
            ],
            // "H": []
          }
        },
        "Thursday": {
          "slots": {
            "A1/A2": [
              { "startTime": "13:00", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:30" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "B2": [
              { "startTime": "13:00", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:30" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "C2": [
              { "startTime": "13:00", "endTime": "13:25" },
              { "startTime": "13:25", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:15" },
              { "startTime": "14:15", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:05" },
              { "startTime": "15:05", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "15:55" },
              { "startTime": "15:55", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "16:45" }
            ],
            "D1": [],
            "D2": [
              { "startTime": "13:00", "endTime": "13:25" },
              { "startTime": "13:25", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:15" },
              { "startTime": "14:15", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:05" },
              { "startTime": "15:05", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "15:55" },
              { "startTime": "15:55", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "16:45" }
            ],
            "I": [],
            "G": [
              { "startTime": "13:00", "endTime": "13:25" },
              { "startTime": "13:25", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:15" },
              { "startTime": "14:15", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:05" },
              { "startTime": "15:05", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "15:55" },
              { "startTime": "15:55", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "16:45" }
            ],
            // "H": []
          }
        },
        "Friday": {
          "slots": {
            "A1/A2": [
              { "startTime": "13:00", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:30" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "B2": [
              { "startTime": "13:00", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:30" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "C2": [
              { "startTime": "13:00", "endTime": "13:25" },
              { "startTime": "13:25", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:15" },
              { "startTime": "14:15", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:05" },
              { "startTime": "15:05", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "15:55" },
              { "startTime": "15:55", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "16:45" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "D2": [
              { "startTime": "13:00", "endTime": "13:25" },
              { "startTime": "13:25", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:15" },
              { "startTime": "14:15", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:05" },
              { "startTime": "15:05", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "15:55" },
              { "startTime": "15:55", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "16:45" }
            ],
            "I": [
              { "startTime": "11:00", "endTime": "12:00" }
            ],
            "G": [
              { "startTime": "13:00", "endTime": "13:25" },
              { "startTime": "13:25", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:15" },
              { "startTime": "14:15", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:05" },
              { "startTime": "15:05", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "15:55" },
              { "startTime": "15:55", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "16:45" }
            ],
            // "H": []
          }
        },
        "Saturday": {
          "slots": {
            "A1/A2": [],
            "B1": [],
            "B2": [],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "C2": [
              { "startTime": "12:00", "endTime": "12:25" },
              { "startTime": "12:25", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:15" }
            ],
            "D1": [],
            "D2": [],
            "I": [],
            "G": [],
            // "H": []
          }
        },
        "Sunday": {
          "slots": {
            "A1/A2": [],
            "B1": [],
            "B2": [],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "C2": [
              { "startTime": "12:00", "endTime": "12:25" },
              { "startTime": "12:25", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:15" }
            ],
            "D1": [],
            "D2": [],
            "I": [],
            "G": [],
            // "H": []
          }
        }
      }
    },
    "4": {
      "weeklyHours": 32,
      "monthlyTurnover": 7300,
      "totalSlots": 96,
      "defaultTimeTable": {
        "Monday": {
          "slots": {
            "A1/A2": [
              { "startTime": "14:00", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "18:10" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" }
            ],
            "B2": [
              { "startTime": "14:00", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "18:10" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" }
            ],
            "C2": [
              { "startTime": "14:00", "endTime": "14:25" },
              { "startTime": "14:25", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:15" },
              { "startTime": "15:15", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" }
            ],
            "D2": [
              { "startTime": "14:00", "endTime": "14:25" },
              { "startTime": "14:25", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:15" },
              { "startTime": "15:15", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" }
            ],
            "I": [],
            "G": [
              { "startTime": "14:00", "endTime": "14:25" },
              { "startTime": "14:25", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:15" },
              { "startTime": "15:15", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" }
            ],
            // "H": []
          }
        },
        "Tuesday": {
          "slots": {
            "A1/A2": [
              { "startTime": "14:00", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "18:10" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" }
            ],
            "B2": [
              { "startTime": "14:00", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "18:10" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" }
            ],
            "C2": [
              { "startTime": "14:00", "endTime": "14:25" },
              { "startTime": "14:25", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:15" },
              { "startTime": "15:15", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" }
            ],
            "D2": [
              { "startTime": "14:00", "endTime": "14:25" },
              { "startTime": "14:25", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:15" },
              { "startTime": "15:15", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" }
            ],
            "I": [],
            "G": [
              { "startTime": "14:00", "endTime": "14:25" },
              { "startTime": "14:25", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:15" },
              { "startTime": "15:15", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" }
            ],
            // "H": []
          }
        },
        "Wednesday": {
          "slots": {
            "A1/A2": [
              { "startTime": "14:00", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "18:10" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" }
            ],
            "B2": [
              { "startTime": "14:00", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "18:10" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" }
            ],
            "C2": [
              { "startTime": "14:00", "endTime": "14:25" },
              { "startTime": "14:25", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:15" },
              { "startTime": "15:15", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" }
            ],
            "D2": [
              { "startTime": "14:00", "endTime": "14:25" },
              { "startTime": "14:25", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:15" },
              { "startTime": "15:15", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" }
            ],
            "I": [],
            "G": [
              { "startTime": "14:00", "endTime": "14:25" },
              { "startTime": "14:25", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:15" },
              { "startTime": "15:15", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" }
            ],
            // "H": []
          }
        },
        "Thursday": {
          "slots": {
            "A1/A2": [
              { "startTime": "14:00", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "18:10" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" }
            ],
            "B2": [
              { "startTime": "14:00", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "18:10" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" }
            ],
            "C2": [
              { "startTime": "14:00", "endTime": "14:25" },
              { "startTime": "14:25", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:15" },
              { "startTime": "15:15", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" }
            ],
            "D2": [
              { "startTime": "14:00", "endTime": "14:25" },
              { "startTime": "14:25", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:15" },
              { "startTime": "15:15", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" }
            ],
            "I": [],
            "G": [
              { "startTime": "14:00", "endTime": "14:25" },
              { "startTime": "14:25", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:15" },
              { "startTime": "15:15", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" }
            ],
            // "H": []
          }
        },
        "Friday": {
          "slots": {
            "A1/A2": [
              { "startTime": "14:00", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "18:10" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "B2": [
              { "startTime": "14:00", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "18:10" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "C2": [
              { "startTime": "14:00", "endTime": "14:25" },
              { "startTime": "14:25", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:15" },
              { "startTime": "15:15", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "D2": [
              { "startTime": "14:00", "endTime": "14:25" },
              { "startTime": "14:25", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:15" },
              { "startTime": "15:15", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" }
            ],
            "I": [
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" }
            ],
            "G": [
              { "startTime": "14:00", "endTime": "14:25" },
              { "startTime": "14:25", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:15" },
              { "startTime": "15:15", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" }
            ],
            // "H": []
          }
        },
        "Saturday": {
          "slots": {
            "A1/A2": [],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" }
            ],
            "B2": [
              { "startTime": "13:00", "endTime": "13:25" },
              { "startTime": "13:25", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:15" },
              { "startTime": "14:15", "endTime": "14:40" }
            ],
            "C1": [],
            "C2": [],
            "D1": [],
            "D2": [],
            "I": [],
            "G": [],
            // "H": []
          }
        },
        "Sunday": {
          "slots": {
            "A1/A2": [],
            "B1": [],
            "B2": [],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" }
            ],
            "C2": [
              { "startTime": "13:00", "endTime": "13:25" },
              { "startTime": "13:25", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:15" },
              { "startTime": "14:15", "endTime": "14:40" }
            ],
            "D1": [],
            "D2": [],
            "I": [],
            "G": [],
            // "H": []
          }
        }
      }
    },
    "5": {
      "weeklyHours": 40,
      "monthlyTurnover": 9300,
      "totalSlots": 112,
      "defaultTimeTable": {
        "Monday": {
          "slots": {
            "A1/A2": [
              { "startTime": "15:00", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "20:00" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "13:00", "endTime": "14:00" }
            ],
            "B2": [
              { "startTime": "15:00", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "20:00" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "13:00", "endTime": "14:00" }
            ],
            "C2": [
              { "startTime": "15:00", "endTime": "15:25" },
              { "startTime": "15:25", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:15" },
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:00" },
              { "startTime": "20:00", "endTime": "20:25" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "13:00", "endTime": "14:00" }
            ],
            "D2": [
              { "startTime": "15:00", "endTime": "15:25" },
              { "startTime": "15:25", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:15" },
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:00" },
              { "startTime": "20:00", "endTime": "20:25" }
            ],
            "I": [],
            "G": [
              { "startTime": "15:00", "endTime": "15:25" },
              { "startTime": "15:25", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:15" },
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:00" },
              { "startTime": "20:00", "endTime": "20:25" }
            ],
            // "H": []
          }
        },
        "Tuesday": {
          "slots": {
            "A1/A2": [
              { "startTime": "15:00", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "20:00" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "13:00", "endTime": "14:00" }
            ],
            "B2": [
              { "startTime": "15:00", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "20:00" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "13:00", "endTime": "14:00" }
            ],
            "C2": [
              { "startTime": "15:00", "endTime": "15:25" },
              { "startTime": "15:25", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:15" },
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:00" },
              { "startTime": "20:00", "endTime": "20:25" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "13:00", "endTime": "14:00" }
            ],
            "D2": [
              { "startTime": "15:00", "endTime": "15:25" },
              { "startTime": "15:25", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:15" },
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:00" },
              { "startTime": "20:00", "endTime": "20:25" }
            ],
            "I": [],
            "G": [
              { "startTime": "15:00", "endTime": "15:25" },
              { "startTime": "15:25", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:15" },
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:00" },
              { "startTime": "20:00", "endTime": "20:25" }
            ],
            // "H": []
          }
        },
        "Wednesday": {
          "slots": {
            "A1/A2": [
              { "startTime": "15:00", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "20:00" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "13:00", "endTime": "14:00" }
            ],
            "B2": [
              { "startTime": "15:00", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "20:00" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "13:00", "endTime": "14:00" }
            ],
            "C2": [
              { "startTime": "15:00", "endTime": "15:25" },
              { "startTime": "15:25", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:15" },
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:00" },
              { "startTime": "20:00", "endTime": "20:25" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "13:00", "endTime": "14:00" }
            ],
            "D2": [
              { "startTime": "15:00", "endTime": "15:25" },
              { "startTime": "15:25", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:15" },
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:00" },
              { "startTime": "20:00", "endTime": "20:25" }
            ],
            "I": [],
            "G": [
              { "startTime": "15:00", "endTime": "15:25" },
              { "startTime": "15:25", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:15" },
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:00" },
              { "startTime": "20:00", "endTime": "20:25" }
            ],
            // "H": []
          }
        },
        "Thursday": {
          "slots": {
            "A1/A2": [
              { "startTime": "15:00", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "20:00" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" }
            ],
            "B2": [
              { "startTime": "15:00", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "20:00" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" }
            ],
            "C2": [
              { "startTime": "15:00", "endTime": "15:25" },
              { "startTime": "15:25", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:15" },
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:00" },
              { "startTime": "20:00", "endTime": "20:25" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" }
            ],
            "D2": [
              { "startTime": "15:00", "endTime": "15:25" },
              { "startTime": "15:25", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:15" },
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:00" },
              { "startTime": "20:00", "endTime": "20:25" }
            ],
            "I": [
              { "startTime": "13:00", "endTime": "14:00" }
            ],
            "G": [
              { "startTime": "15:00", "endTime": "15:25" },
              { "startTime": "15:25", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:15" },
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:00" },
              { "startTime": "20:00", "endTime": "20:25" }
            ],
            // "H": []
          }
        },
        "Friday": {
          "slots": {
            "A1/A2": [
              { "startTime": "15:00", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "20:00" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" }
            ],
            "B2": [
              { "startTime": "15:00", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "20:00" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" }
            ],
            "C2": [
              { "startTime": "15:00", "endTime": "15:25" },
              { "startTime": "15:25", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:15" },
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:00" },
              { "startTime": "20:00", "endTime": "20:25" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" }
            ],
            "D2": [
              { "startTime": "15:00", "endTime": "15:25" },
              { "startTime": "15:25", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:15" },
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:00" },
              { "startTime": "20:00", "endTime": "20:25" }
            ],
            "I": [
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "13:00", "endTime": "14:00" }
            ],
            "G": [
              { "startTime": "15:00", "endTime": "15:25" },
              { "startTime": "15:25", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:15" },
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:00" },
              { "startTime": "20:00", "endTime": "20:25" }
            ],
            // "H": [],

          }
        },
        "Saturday": {
          "slots": {
            "A1/A2": [],
            "B1": [],
            "B2": [],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" }
            ],
            "C2": [
              { "startTime": "14:00", "endTime": "14:25" },
              { "startTime": "14:25", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:15" },
              { "startTime": "15:15", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:30" }
            ],
            "D1": [],
            "D2": [],
            "I": [],
            "G": [],
            // "H": []
          }
        },
        "Sunday": {
          "slots": {
            "A1/A2": [],
            "B1": [],
            "B2": [],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" }
            ],
            "C2": [
              { "startTime": "14:00", "endTime": "14:25" },
              { "startTime": "14:25", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:15" },
              { "startTime": "15:15", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:30" }
            ],
            "D1": [],
            "D2": [],
            "I": [],
            "G": [],
            // "H": []
          }
        }
      }
    },

    "6": {
      "weeklyHours": 48,
      "monthlyTurnover": 11000,
      "totalSlots": 134,
      "defaultTimeTable": {
        "Monday": {
          "slots": {
            "A1/A2": [
              { "startTime": "16:15", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:25" },
              { "startTime": "20:25", "endTime": "21:15" },
              { "startTime": "21:15", "endTime": "22:05" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "14:00", "endTime": "15:00" },
              { "startTime": "15:00", "endTime": "16:00" }
            ],
            "B2": [
              { "startTime": "16:15", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:25" },
              { "startTime": "20:25", "endTime": "21:15" },
              { "startTime": "21:15", "endTime": "22:05" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "14:00", "endTime": "15:00" },
              { "startTime": "15:00", "endTime": "16:00" }
            ],
            "C2": [
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:00" },
              { "startTime": "20:00", "endTime": "20:25" },
              { "startTime": "20:25", "endTime": "20:50" },
              { "startTime": "20:50", "endTime": "21:15" },
              { "startTime": "21:15", "endTime": "21:40" },
              { "startTime": "21:40", "endTime": "22:05" },
              { "startTime": "22:05", "endTime": "22:30" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "14:00", "endTime": "15:00" },
              { "startTime": "15:00", "endTime": "16:00" }
            ],
            "D2": [
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:00" },
              { "startTime": "20:00", "endTime": "20:25" },
              { "startTime": "20:25", "endTime": "20:50" },
              { "startTime": "20:50", "endTime": "21:15" },
              { "startTime": "21:15", "endTime": "21:40" },
              { "startTime": "21:40", "endTime": "22:05" },
              { "startTime": "22:05", "endTime": "22:30" }
            ],
            "I": [],
            "G": [
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:00" },
              { "startTime": "20:00", "endTime": "20:25" },
              { "startTime": "20:25", "endTime": "20:50" },
              { "startTime": "20:50", "endTime": "21:15" },
              { "startTime": "21:15", "endTime": "21:40" },
              { "startTime": "21:40", "endTime": "22:05" },
              { "startTime": "22:05", "endTime": "22:30" }
            ],
            // "H": []
          }
        },
        "Tuesday": {
          "slots": {
            "A1/A2": [
              { "startTime": "16:15", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:25" },
              { "startTime": "20:25", "endTime": "21:15" },
              { "startTime": "21:15", "endTime": "22:05" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "14:00", "endTime": "15:00" },
              { "startTime": "15:00", "endTime": "16:00" }
            ],
            "B2": [
              { "startTime": "16:15", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:25" },
              { "startTime": "20:25", "endTime": "21:15" },
              { "startTime": "21:15", "endTime": "22:05" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "14:00", "endTime": "15:00" },
              { "startTime": "15:00", "endTime": "16:00" }
            ],
            "C2": [
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:00" },
              { "startTime": "20:00", "endTime": "20:25" },
              { "startTime": "20:25", "endTime": "20:50" },
              { "startTime": "20:50", "endTime": "21:15" },
              { "startTime": "21:15", "endTime": "21:40" },
              { "startTime": "21:40", "endTime": "22:05" },
              { "startTime": "22:05", "endTime": "22:30" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "14:00", "endTime": "15:00" },
              { "startTime": "15:00", "endTime": "16:00" }
            ],
            "D2": [
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:00" },
              { "startTime": "20:00", "endTime": "20:25" },
              { "startTime": "20:25", "endTime": "20:50" },
              { "startTime": "20:50", "endTime": "21:15" },
              { "startTime": "21:15", "endTime": "21:40" },
              { "startTime": "21:40", "endTime": "22:05" },
              { "startTime": "22:05", "endTime": "22:30" }
            ],
            "I": [],
            "G": [
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:00" },
              { "startTime": "20:00", "endTime": "20:25" },
              { "startTime": "20:25", "endTime": "20:50" },
              { "startTime": "20:50", "endTime": "21:15" },
              { "startTime": "21:15", "endTime": "21:40" },
              { "startTime": "21:40", "endTime": "22:05" },
              { "startTime": "22:05", "endTime": "22:30" }
            ],
            // "H": []
          }
        },
        "Wednesday": {
          "slots": {
            "A1/A2": [
              { "startTime": "16:15", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:25" },
              { "startTime": "20:25", "endTime": "21:15" },
              { "startTime": "21:15", "endTime": "22:05" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "14:00", "endTime": "15:00" }
            ],
            "B2": [
              { "startTime": "16:15", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:25" },
              { "startTime": "20:25", "endTime": "21:15" },
              { "startTime": "21:15", "endTime": "22:05" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "14:00", "endTime": "15:00" }
            ],
            "C2": [
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:00" },
              { "startTime": "20:00", "endTime": "20:25" },
              { "startTime": "20:25", "endTime": "20:50" },
              { "startTime": "20:50", "endTime": "21:15" },
              { "startTime": "21:15", "endTime": "21:40" },
              { "startTime": "21:40", "endTime": "22:05" },
              { "startTime": "22:05", "endTime": "22:30" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "14:00", "endTime": "15:00" }
            ],
            "D2": [
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:00" },
              { "startTime": "20:00", "endTime": "20:25" },
              { "startTime": "20:25", "endTime": "20:50" },
              { "startTime": "20:50", "endTime": "21:15" },
              { "startTime": "21:15", "endTime": "21:40" },
              { "startTime": "21:40", "endTime": "22:05" },
              { "startTime": "22:05", "endTime": "22:30" }
            ],
            "I": [
              { "startTime": "15:00", "endTime": "16:00" }
            ],
            "G": [
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:00" },
              { "startTime": "20:00", "endTime": "20:25" },
              { "startTime": "20:25", "endTime": "20:50" },
              { "startTime": "20:50", "endTime": "21:15" },
              { "startTime": "21:15", "endTime": "21:40" },
              { "startTime": "21:40", "endTime": "22:05" },
              { "startTime": "22:05", "endTime": "22:30" }
            ],
            // "H": []
          }
        },
        "Thursday": {
          "slots": {
            "A1/A2": [
              { "startTime": "16:15", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:25" },
              { "startTime": "20:25", "endTime": "21:15" },
              { "startTime": "21:15", "endTime": "22:05" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "14:00", "endTime": "15:00" }
            ],
            "B2": [
              { "startTime": "16:15", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:25" },
              { "startTime": "20:25", "endTime": "21:15" },
              { "startTime": "21:15", "endTime": "22:05" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "14:00", "endTime": "15:00" }
            ],
            "C2": [
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:00" },
              { "startTime": "20:00", "endTime": "20:25" },
              { "startTime": "20:25", "endTime": "20:50" },
              { "startTime": "20:50", "endTime": "21:15" },
              { "startTime": "21:15", "endTime": "21:40" },
              { "startTime": "21:40", "endTime": "22:05" },
              { "startTime": "22:05", "endTime": "22:30" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "14:00", "endTime": "15:00" }
            ],
            "D2": [
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:00" },
              { "startTime": "20:00", "endTime": "20:25" },
              { "startTime": "20:25", "endTime": "20:50" },
              { "startTime": "20:50", "endTime": "21:15" },
              { "startTime": "21:15", "endTime": "21:40" },
              { "startTime": "21:40", "endTime": "22:05" },
              { "startTime": "22:05", "endTime": "22:30" }
            ],
            "I": [
              { "startTime": "15:00", "endTime": "16:00" }
            ],
            "G": [
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:00" },
              { "startTime": "20:00", "endTime": "20:25" },
              { "startTime": "20:25", "endTime": "20:50" },
              { "startTime": "20:50", "endTime": "21:15" },
              { "startTime": "21:15", "endTime": "21:40" },
              { "startTime": "21:40", "endTime": "22:05" },
              { "startTime": "22:05", "endTime": "22:30" }
            ],
            // "H": []
          }
        },
        "Friday": {
          "slots": {
            "A1/A2": [
              { "startTime": "16:15", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:25" },
              { "startTime": "20:25", "endTime": "21:15" },
              { "startTime": "21:15", "endTime": "22:05" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "14:00", "endTime": "15:00" }
            ],
            "B2": [
              { "startTime": "16:15", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:25" },
              { "startTime": "20:25", "endTime": "21:15" },
              { "startTime": "21:15", "endTime": "22:05" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "13:00", "endTime": "14:00" }
            ],
            "C2": [
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:00" },
              { "startTime": "20:00", "endTime": "20:25" },
              { "startTime": "20:25", "endTime": "20:50" },
              { "startTime": "20:50", "endTime": "21:15" },
              { "startTime": "21:15", "endTime": "21:40" },
              { "startTime": "21:40", "endTime": "22:05" },
              { "startTime": "22:05", "endTime": "22:30" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "13:00", "endTime": "14:00" }
            ],
            "D2": [
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:00" },
              { "startTime": "20:00", "endTime": "20:25" },
              { "startTime": "20:25", "endTime": "20:50" },
              { "startTime": "20:50", "endTime": "21:15" },
              { "startTime": "21:15", "endTime": "21:40" },
              { "startTime": "21:40", "endTime": "22:05" },
              { "startTime": "22:05", "endTime": "22:30" }
            ],
            "I": [
              { "startTime": "15:00", "endTime": "16:00" }
            ],
            "G": [
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:00" },
              { "startTime": "20:00", "endTime": "20:25" },
              { "startTime": "20:25", "endTime": "20:50" },
              { "startTime": "20:50", "endTime": "21:15" },
              { "startTime": "21:15", "endTime": "21:40" },
              { "startTime": "21:40", "endTime": "22:05" },
              { "startTime": "22:05", "endTime": "22:30" }
            ],
            // "H": [],

          }
        },
        "Saturday": {
          "slots": {
            "A1/A2": [],
            "B1": [],
            "B2": [],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "13:00", "endTime": "14:00" }
            ],
            "C2": [
              { "startTime": "15:00", "endTime": "15:25" },
              { "startTime": "15:25", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:15" },
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" }
            ],
            "D1": [],
            "D2": [],
            "I": [],
            "G": [],
            // "H": []
          }
        },
        "Sunday": {
          "slots": {
            "A1/A2": [],
            "B1": [],
            "B2": [],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "13:00", "endTime": "14:00" }
            ],
            "C2": [
              { "startTime": "15:00", "endTime": "15:25" },
              { "startTime": "15:25", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:15" },
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" }
            ],
            "D1": [],
            "D2": [],
            "I": [],
            "G": [],
            // "H": []
          }
        }
      }
    },
  },
  "ULTIMATE": {
    "2": {
      "weeklyHours": 19,
      "monthlyTurnover": 4000,
      "totalSlots": 60,
      "defaultTimeTable": {
        "Monday": {
          "slots": {
            "A1/A2": [
              { "startTime": "12:00", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:30" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "B2": [
              { "startTime": "12:00", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:30" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "C2": [
              { "startTime": "12:00", "endTime": "12:25" },
              { "startTime": "12:25", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:15" },
              { "startTime": "13:15", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:05" },
              { "startTime": "14:05", "endTime": "14:30" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "D2": [
              { "startTime": "12:00", "endTime": "12:25" },
              { "startTime": "12:25", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:15" },
              { "startTime": "13:15", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:05" },
              { "startTime": "14:05", "endTime": "14:30" }
            ],
            "E1": [],
            "E2": [],
            "F1": [],
            "F2": [],
            "I": [],
            "G": [
              { "startTime": "12:00", "endTime": "12:25" },
              { "startTime": "12:25", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:15" },
              { "startTime": "13:15", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:05" },
              { "startTime": "14:05", "endTime": "14:30" }
            ],
            // "H": []
          }
        },
        "Tuesday": {
          "slots": {
            "A1/A2": [
              { "startTime": "12:00", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:30" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "B2": [
              { "startTime": "12:00", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:30" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "C2": [
              { "startTime": "12:00", "endTime": "12:25" },
              { "startTime": "12:25", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:15" },
              { "startTime": "13:15", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:05" },
              { "startTime": "14:05", "endTime": "14:30" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "D2": [
              { "startTime": "12:00", "endTime": "12:25" },
              { "startTime": "12:25", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:15" },
              { "startTime": "13:15", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:05" },
              { "startTime": "14:05", "endTime": "14:30" }
            ],
            "E1": [],
            "E2": [],
            "F1": [],
            "F2": [],
            "I": [],
            "G": [
              { "startTime": "12:00", "endTime": "12:25" },
              { "startTime": "12:25", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:15" },
              { "startTime": "13:15", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:05" },
              { "startTime": "14:05", "endTime": "14:30" }
            ],
            // "H": []
          }
        },
        "Wednesday": {
          "slots": {
            "A1/A2": [
              { "startTime": "12:00", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:30" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "B2": [
              { "startTime": "12:00", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:30" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "C2": [
              { "startTime": "12:00", "endTime": "12:25" },
              { "startTime": "12:25", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:15" },
              { "startTime": "13:15", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:05" },
              { "startTime": "14:05", "endTime": "14:30" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "D2": [
              { "startTime": "12:00", "endTime": "12:25" },
              { "startTime": "12:25", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:15" },
              { "startTime": "13:15", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:05" },
              { "startTime": "14:05", "endTime": "14:30" }
            ],
            "E1": [
              { "startTime": "18:00", "endTime": "20:20" }
            ],
            "E2": [
              { "startTime": "18:00", "endTime": "20:20" }
            ],
            "F1": [],
            "F2": [],
            "I": [],
            "G": [
              { "startTime": "12:00", "endTime": "12:25" },
              { "startTime": "12:25", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:15" },
              { "startTime": "13:15", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:05" },
              { "startTime": "14:05", "endTime": "14:30" }
            ],
            // "H": []
          }
        },
        "Thursday": {
          "slots": {
            "A1/A2": [
              { "startTime": "12:00", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:30" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" }
            ],
            "B2": [
              { "startTime": "12:00", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:30" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" }
            ],
            "C2": [
              { "startTime": "12:00", "endTime": "12:25" },
              { "startTime": "12:25", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:15" },
              { "startTime": "13:15", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:05" },
              { "startTime": "14:05", "endTime": "14:30" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" }
            ],
            "D2": [
              { "startTime": "12:00", "endTime": "12:25" },
              { "startTime": "12:25", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:15" },
              { "startTime": "13:15", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:05" },
              { "startTime": "14:05", "endTime": "14:30" }
            ],
            "E1": [],
            "E2": [],
            "F1": [],
            "F2": [],
            "I": [
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "G": [
              { "startTime": "12:00", "endTime": "12:25" },
              { "startTime": "12:25", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:15" },
              { "startTime": "13:15", "endTime": "13:40" },
              { "startTime": "13:40", "endTime": "14:05" },
              { "startTime": "14:05", "endTime": "14:30" }
            ],
            // "H": []
          }
        },
        "Friday": {
          "slots": {
            "A1/A2": [
              { "startTime": "12:45", "endTime": "13:35" },
              { "startTime": "13:35", "endTime": "14:25" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" }
            ],
            "B2": [
              { "startTime": "12:45", "endTime": "13:35" },
              { "startTime": "13:35", "endTime": "14:25" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" }
            ],
            "C2": [
              { "startTime": "12:45", "endTime": "13:10" },
              { "startTime": "13:10", "endTime": "13:35" },
              { "startTime": "13:35", "endTime": "14:00" },
              { "startTime": "14:00", "endTime": "14:25" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" }
            ],
            "D2": [
              { "startTime": "12:45", "endTime": "13:10" },
              { "startTime": "13:10", "endTime": "13:35" },
              { "startTime": "13:35", "endTime": "14:00" },
              { "startTime": "14:00", "endTime": "14:25" }
            ],
            "E1": [],
            "E2": [],
            "F1": [
              { "startTime": "11:00", "endTime": "12:15" }
            ],
            "F2": [
              { "startTime": "11:00", "endTime": "12:15" }
            ],
            "I": [],
            "G": [
              { "startTime": "12:45", "endTime": "13:10" },
              { "startTime": "13:10", "endTime": "13:35" },
              { "startTime": "13:35", "endTime": "14:00" },
              { "startTime": "14:00", "endTime": "14:25" }
            ],
            // "H": []
          }
        },
        "Saturday": {
          "slots": {
            "A1/A2": [],
            "B1": [],
            "B2": [],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" }
            ],
            "C2": [
              { "startTime": "12:00", "endTime": "12:25" },
              { "startTime": "12:25", "endTime": "12:50" }
            ],
            "D1": [],
            "D2": [],
            "E1": [],
            "E2": [],
            "F1": [],
            "F2": [],
            "I": [],
            "G": [],
            // "H": []
          }
        },
        "Sunday": {
          "slots": {
            "A1/A2": [],
            "B1": [],
            "B2": [],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" }
            ],
            "C2": [
              { "startTime": "12:00", "endTime": "12:25" },
              { "startTime": "12:25", "endTime": "12:50" }
            ],
            "D1": [],
            "D2": [],
            "E1": [],
            "E2": [],
            "F1": [],
            "F2": [],
            "I": [],
            "G": [],
            // "H": []
          }
        }
      }
    },
    "3": {
      "weeklyHours": 27,
      "monthlyTurnover": 6200,
      "totalSlots": 87,
      "defaultTimeTable": {
        "Monday": {
          "slots": {
            "A1/A2": [
              { "startTime": "13:00", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "17:10" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" }
            ],
            "B2": [
              { "startTime": "13:00", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "17:10" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" }
            ],
            "C2": [
              { "startTime": "13:00", "endTime": "13:25" },
              { "startTime": "13:25", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:15" },
              { "startTime": "14:15", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:05" },
              { "startTime": "15:05", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "15:55" },
              { "startTime": "15:55", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "16:45" },
              { "startTime": "16:45", "endTime": "17:10" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" }
            ],
            "D2": [
              { "startTime": "13:00", "endTime": "13:25" },
              { "startTime": "13:25", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:15" },
              { "startTime": "14:15", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:05" },
              { "startTime": "15:05", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "15:55" },
              { "startTime": "15:55", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "16:45" },
              { "startTime": "16:45", "endTime": "17:10" }
            ],
            "E1": [],
            "E2": [],
            "F1": [],
            "F2": [],
            "I": [],
            "G": [
              { "startTime": "13:00", "endTime": "13:25" },
              { "startTime": "13:25", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:15" },
              { "startTime": "14:15", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:05" },
              { "startTime": "15:05", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "15:55" },
              { "startTime": "15:55", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "16:45" },
              { "startTime": "16:45", "endTime": "17:10" }
            ],
            // "H": []
          }
        },
        "Tuesday": {
          "slots": {
            "A1/A2": [
              { "startTime": "13:00", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "17:10" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" }
            ],
            "B2": [
              { "startTime": "13:00", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "17:10" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" }
            ],
            "C2": [
              { "startTime": "13:00", "endTime": "13:25" },
              { "startTime": "13:25", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:15" },
              { "startTime": "14:15", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:05" },
              { "startTime": "15:05", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "15:55" },
              { "startTime": "15:55", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "16:45" },
              { "startTime": "16:45", "endTime": "17:10" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" }
            ],
            "D2": [
              { "startTime": "13:00", "endTime": "13:25" },
              { "startTime": "13:25", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:15" },
              { "startTime": "14:15", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:05" },
              { "startTime": "15:05", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "15:55" },
              { "startTime": "15:55", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "16:45" },
              { "startTime": "16:45", "endTime": "17:10" }
            ],
            "E1": [],
            "E2": [],
            "F1": [],
            "F2": [],
            "I": [],
            "G": [
              { "startTime": "13:00", "endTime": "13:25" },
              { "startTime": "13:25", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:15" },
              { "startTime": "14:15", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:05" },
              { "startTime": "15:05", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "15:55" },
              { "startTime": "15:55", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "16:45" },
              { "startTime": "16:45", "endTime": "17:10" }
            ],
            // "H": []
          }
        },
        "Wednesday": {
          "slots": {
            "A1/A2": [
              { "startTime": "13:00", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "17:10" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" }
            ],
            "B2": [
              { "startTime": "13:00", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "17:10" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" }
            ],
            "C2": [
              { "startTime": "13:00", "endTime": "13:25" },
              { "startTime": "13:25", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:15" },
              { "startTime": "14:15", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:05" },
              { "startTime": "15:05", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "15:55" },
              { "startTime": "15:55", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "16:45" },
              { "startTime": "16:45", "endTime": "17:10" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" }
            ],
            "D2": [
              { "startTime": "13:00", "endTime": "13:25" },
              { "startTime": "13:25", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:15" },
              { "startTime": "14:15", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:05" },
              { "startTime": "15:05", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "15:55" },
              { "startTime": "15:55", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "16:45" },
              { "startTime": "16:45", "endTime": "17:10" }
            ],
            "E1": [
              { "startTime": "18:00", "endTime": "20:20" }
            ],
            "E2": [
              { "startTime": "18:00", "endTime": "20:20" }
            ],
            "F1": [],
            "F2": [],
            "I": [],
            "G": [
              { "startTime": "13:00", "endTime": "13:25" },
              { "startTime": "13:25", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:15" },
              { "startTime": "14:15", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:05" },
              { "startTime": "15:05", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "15:55" },
              { "startTime": "15:55", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "16:45" },
              { "startTime": "16:45", "endTime": "17:10" }
            ],
            // "H": []
          }
        },
        "Thursday": {
          "slots": {
            "A1/A2": [
              { "startTime": "13:00", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "17:10" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "B2": [
              { "startTime": "13:00", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "17:10" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "C2": [
              { "startTime": "13:00", "endTime": "13:25" },
              { "startTime": "13:25", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:15" },
              { "startTime": "14:15", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:05" },
              { "startTime": "15:05", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "15:55" },
              { "startTime": "15:55", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "16:45" },
              { "startTime": "16:45", "endTime": "17:10" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "D2": [
              { "startTime": "13:00", "endTime": "13:25" },
              { "startTime": "13:25", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:15" },
              { "startTime": "14:15", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:05" },
              { "startTime": "15:05", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "15:55" },
              { "startTime": "15:55", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "16:45" },
              { "startTime": "16:45", "endTime": "17:10" }
            ],
            "E1": [],
            "E2": [],
            "F1": [],
            "F2": [],
            "I": [
              { "startTime": "11:00", "endTime": "12:00" }
            ],
            "G": [
              { "startTime": "13:00", "endTime": "13:25" },
              { "startTime": "13:25", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:15" },
              { "startTime": "14:15", "endTime": "14:40" },
              { "startTime": "14:40", "endTime": "15:05" },
              { "startTime": "15:05", "endTime": "15:30" },
              { "startTime": "15:30", "endTime": "15:55" },
              { "startTime": "15:55", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "16:45" },
              { "startTime": "16:45", "endTime": "17:10" }
            ],
            // "H": []
          }
        },
        "Friday": {
          "slots": {
            "A1/A2": [
              { "startTime": "14:30", "endTime": "15:20" },
              { "startTime": "15:20", "endTime": "16:10" },
              { "startTime": "16:10", "endTime": "17:00" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "B2": [
              { "startTime": "14:30", "endTime": "15:20" },
              { "startTime": "15:20", "endTime": "16:10" },
              { "startTime": "16:10", "endTime": "17:00" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "C2": [
              { "startTime": "14:30", "endTime": "14:55" },
              { "startTime": "14:55", "endTime": "15:20" },
              { "startTime": "15:20", "endTime": "15:45" },
              { "startTime": "15:45", "endTime": "16:10" },
              { "startTime": "16:10", "endTime": "16:35" },
              { "startTime": "16:35", "endTime": "17:00" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "D2": [
              { "startTime": "14:30", "endTime": "14:55" },
              { "startTime": "14:55", "endTime": "15:20" },
              { "startTime": "15:20", "endTime": "15:45" },
              { "startTime": "15:45", "endTime": "16:10" },
              { "startTime": "16:10", "endTime": "16:35" },
              { "startTime": "16:35", "endTime": "17:00" }
            ],
            "E1": [],
            "E2": [],
            "F1": [
              { "startTime": "13:00", "endTime": "14:15" }
            ],
            "F2": [
              { "startTime": "13:00", "endTime": "14:15" }
            ],
            "I": [
              { "startTime": "11:00", "endTime": "12:00" }
            ],
            "G": [
              { "startTime": "14:30", "endTime": "14:55" },
              { "startTime": "14:55", "endTime": "15:20" },
              { "startTime": "15:20", "endTime": "15:45" },
              { "startTime": "15:45", "endTime": "16:10" },
              { "startTime": "16:10", "endTime": "16:35" },
              { "startTime": "16:35", "endTime": "17:00" }
            ],
            // "H": []
          }
        },
        "Saturday": {
          "slots": {
            "A1/A2": [],
            "B1": [],
            "B2": [],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "C2": [
              { "startTime": "12:00", "endTime": "12:25" },
              { "startTime": "12:25", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:15" }
            ],
            "D1": [],
            "D2": [],
            "E1": [],
            "E2": [],
            "F1": [],
            "F2": [],
            "I": [],
            "G": [],
            // "H": []
          }
        },
        "Sunday": {
          "slots": {
            "A1/A2": [],
            "B1": [],
            "B2": [],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "C2": [
              { "startTime": "12:00", "endTime": "12:25" },
              { "startTime": "12:25", "endTime": "12:50" },
              { "startTime": "12:50", "endTime": "13:15" }
            ],
            "D1": [],
            "D2": [],
            "E1": [],
            "E2": [],
            "F1": [],
            "F2": [],
            "I": [],
            "G": [],
            // "H": []
          }
        }
      }
    },
    "4": {
      "weeklyHours": 35,
      "monthlyTurnover": 8100,
      "totalSlots": 100,
      "defaultTimeTable": {
        "Monday": {
          "slots": {
            "A1/A2": [
              { "startTime": "14:00", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "19:00" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" }
            ],
            "B2": [
              { "startTime": "14:00", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "19:00" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" }
            ],
            "C2": [
              { "startTime": "14:00", "endTime": "14:25" },
              { "startTime": "14:25", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:15" },
              { "startTime": "15:15", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" },
              { "startTime": "18:35", "endTime": "19:00" },
              { "startTime": "19:00", "endTime": "19:25" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" }
            ],
            "D2": [
              { "startTime": "14:00", "endTime": "14:25" },
              { "startTime": "14:25", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:15" },
              { "startTime": "15:15", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" },
              { "startTime": "18:35", "endTime": "19:00" },
              { "startTime": "19:00", "endTime": "19:25" }
            ],
            "E1": [],
            "E2": [],
            "F1": [],
            "F2": [],
            "I": [],
            "G": [
              { "startTime": "14:00", "endTime": "14:25" },
              { "startTime": "14:25", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:15" },
              { "startTime": "15:15", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" },
              { "startTime": "18:35", "endTime": "19:00" },
              { "startTime": "19:00", "endTime": "19:25" }
            ],
            // "H": []
          }
        },
        "Tuesday": {
          "slots": {
            "A1/A2": [
              { "startTime": "14:00", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "19:00" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" }
            ],
            "B2": [
              { "startTime": "14:00", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "19:00" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" }
            ],
            "C2": [
              { "startTime": "14:00", "endTime": "14:25" },
              { "startTime": "14:25", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:15" },
              { "startTime": "15:15", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" },
              { "startTime": "18:35", "endTime": "19:00" },
              { "startTime": "19:00", "endTime": "19:25" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" }
            ],
            "D2": [
              { "startTime": "14:00", "endTime": "14:25" },
              { "startTime": "14:25", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:15" },
              { "startTime": "15:15", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" },
              { "startTime": "18:35", "endTime": "19:00" },
              { "startTime": "19:00", "endTime": "19:25" }
            ],
            "E1": [],
            "E2": [],
            "F1": [],
            "F2": [],
            "I": [],
            "G": [
              { "startTime": "14:00", "endTime": "14:25" },
              { "startTime": "14:25", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:15" },
              { "startTime": "15:15", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" },
              { "startTime": "18:35", "endTime": "19:00" },
              { "startTime": "19:00", "endTime": "19:25" }
            ],
            // "H": []
          }
        },
        "Wednesday": {
          "slots": {
            "A1/A2": [
              { "startTime": "14:00", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "19:00" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" }
            ],
            "B2": [
              { "startTime": "14:00", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "19:00" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" }
            ],
            "C2": [
              { "startTime": "14:00", "endTime": "14:25" },
              { "startTime": "14:25", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:15" },
              { "startTime": "15:15", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" },
              { "startTime": "18:35", "endTime": "19:00" },
              { "startTime": "19:00", "endTime": "19:25" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" }
            ],
            "D2": [
              { "startTime": "14:00", "endTime": "14:25" },
              { "startTime": "14:25", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:15" },
              { "startTime": "15:15", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" },
              { "startTime": "18:35", "endTime": "19:00" },
              { "startTime": "19:00", "endTime": "19:25" }
            ],
            "E1": [
              { "startTime": "18:00", "endTime": "20:20" }
            ],
            "E2": [
              { "startTime": "18:00", "endTime": "20:20" }
            ],
            "F1": [],
            "F2": [],
            "I": [],
            "G": [
              { "startTime": "14:00", "endTime": "14:25" },
              { "startTime": "14:25", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:15" },
              { "startTime": "15:15", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" },
              { "startTime": "18:35", "endTime": "19:00" },
              { "startTime": "19:00", "endTime": "19:25" }
            ],
            // "H": []
          }
        },
        "Thursday": {
          "slots": {
            "A1/A2": [
              { "startTime": "14:00", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "19:00" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" }
            ],
            "B2": [
              { "startTime": "14:00", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "19:00" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" }
            ],
            "C2": [
              { "startTime": "14:00", "endTime": "14:25" },
              { "startTime": "14:25", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:15" },
              { "startTime": "15:15", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" },
              { "startTime": "18:35", "endTime": "19:00" },
              { "startTime": "19:00", "endTime": "19:25" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" }
            ],
            "D2": [
              { "startTime": "14:00", "endTime": "14:25" },
              { "startTime": "14:25", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:15" },
              { "startTime": "15:15", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" },
              { "startTime": "18:35", "endTime": "19:00" },
              { "startTime": "19:00", "endTime": "19:25" }
            ],
            "E1": [],
            "E2": [],
            "F1": [],
            "F2": [],
            "I": [],
            "G": [
              { "startTime": "14:00", "endTime": "14:25" },
              { "startTime": "14:25", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:15" },
              { "startTime": "15:15", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" },
              { "startTime": "18:35", "endTime": "19:00" },
              { "startTime": "19:00", "endTime": "19:25" }
            ],
            // "H": []
          }
        },
        "Friday": {
          "slots": {
            "A1/A2": [
              { "startTime": "15:30", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "17:10" },
              { "startTime": "17:10", "endTime": "18:00" },
              { "startTime": "18:00", "endTime": "18:50" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "B2": [
              { "startTime": "15:30", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "17:10" },
              { "startTime": "17:10", "endTime": "18:00" },
              { "startTime": "18:00", "endTime": "18:50" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "C2": [
              { "startTime": "15:30", "endTime": "15:55" },
              { "startTime": "15:55", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "16:45" },
              { "startTime": "16:45", "endTime": "17:10" },
              { "startTime": "17:10", "endTime": "17:35" },
              { "startTime": "17:35", "endTime": "18:00" },
              { "startTime": "18:00", "endTime": "18:25" },
              { "startTime": "18:25", "endTime": "18:50" },
              { "startTime": "18:50", "endTime": "19:15" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" }
            ],
            "D2": [
              { "startTime": "15:30", "endTime": "15:55" },
              { "startTime": "15:55", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "16:45" },
              { "startTime": "16:45", "endTime": "17:10" },
              { "startTime": "17:10", "endTime": "17:35" },
              { "startTime": "17:35", "endTime": "18:00" },
              { "startTime": "18:00", "endTime": "18:25" },
              { "startTime": "18:25", "endTime": "18:50" },
              { "startTime": "18:50", "endTime": "19:15" }
            ],
            "E1": [],
            "E2": [],
            "F1": [
              { "startTime": "14:00", "endTime": "15:15" }
            ],
            "F2": [
              { "startTime": "14:00", "endTime": "15:15" }
            ],
            "I": [
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" }
            ],
            "G": [
              { "startTime": "15:30", "endTime": "15:55" },
              { "startTime": "15:55", "endTime": "16:20" },
              { "startTime": "16:20", "endTime": "16:45" },
              { "startTime": "16:45", "endTime": "17:10" },
              { "startTime": "17:10", "endTime": "17:35" },
              { "startTime": "17:35", "endTime": "18:00" },
              { "startTime": "18:00", "endTime": "18:25" },
              { "startTime": "18:25", "endTime": "18:50" },
              { "startTime": "18:50", "endTime": "19:15" }
            ],
            // "H": []
          }
        },
        "Saturday": {
          "slots": {
            "A1/A2": [],
            "B1": [],
            "B2": [],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" }
            ],
            "C2": [
              { "startTime": "13:00", "endTime": "13:25" },
              { "startTime": "13:25", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:15" },
              { "startTime": "14:15", "endTime": "14:40" }
            ],
            "D1": [],
            "D2": [],
            "E1": [],
            "E2": [],
            "F1": [],
            "F2": [],
            "I": [],
            "G": [],
            // "H": []
          }
        },
        "Sunday": {
          "slots": {
            "A1/A2": [],
            "B1": [],
            "B2": [],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" }
            ],
            "C2": [
              { "startTime": "13:00", "endTime": "13:25" },
              { "startTime": "13:25", "endTime": "13:50" },
              { "startTime": "13:50", "endTime": "14:15" },
              { "startTime": "14:15", "endTime": "14:40" }
            ],
            "D1": [],
            "D2": [],
            "E1": [],
            "E2": [],
            "F1": [],
            "F2": [],
            "I": [],
            "G": [],
            // "H": []
          }
        },
      }
    },
    "5": {
      "weeklyHours": 45,
      "monthlyTurnover": 10200,
      "totalSlots": 116,
      "defaultTimeTable": {
        "Monday": {
          "slots": {
            "A1/A2": [
              { "startTime": "15:00", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "20:00" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "13:00", "endTime": "14:00" }
            ],
            "B2": [
              { "startTime": "15:00", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "20:00" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "13:00", "endTime": "14:00" }
            ],
            "C2": [
              { "startTime": "15:00", "endTime": "15:25" },
              { "startTime": "15:25", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:15" },
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:00" },
              { "startTime": "20:00", "endTime": "20:25" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "13:00", "endTime": "14:00" }
            ],
            "D2": [
              { "startTime": "15:00", "endTime": "15:25" },
              { "startTime": "15:25", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:15" },
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:00" },
              { "startTime": "20:00", "endTime": "20:25" }
            ],
            "E1": [],
            "E2": [],
            "F1": [],
            "F2": [],
            "I": [],
            "G": [
              { "startTime": "15:00", "endTime": "15:25" },
              { "startTime": "15:25", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:15" },
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:00" },
              { "startTime": "20:00", "endTime": "20:25" }
            ],
            // "H": []
          }
        },
        "Tuesday": {
          "slots": {
            "A1/A2": [
              { "startTime": "15:00", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "20:00" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "13:00", "endTime": "14:00" }
            ],
            "B2": [
              { "startTime": "15:00", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "20:00" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "13:00", "endTime": "14:00" }
            ],
            "C2": [
              { "startTime": "15:00", "endTime": "15:25" },
              { "startTime": "15:25", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:15" },
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:00" },
              { "startTime": "20:00", "endTime": "20:25" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "13:00", "endTime": "14:00" }
            ],
            "D2": [
              { "startTime": "15:00", "endTime": "15:25" },
              { "startTime": "15:25", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:15" },
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:00" },
              { "startTime": "20:00", "endTime": "20:25" }
            ],
            "E1": [],
            "E2": [],
            "F1": [],
            "F2": [],
            "I": [],
            "G": [
              { "startTime": "15:00", "endTime": "15:25" },
              { "startTime": "15:25", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:15" },
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:00" },
              { "startTime": "20:00", "endTime": "20:25" }
            ],
            // "H": []
          }
        },
        "Wednesday": {
          "slots": {
            "A1/A2": [
              { "startTime": "15:00", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "20:00" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "13:00", "endTime": "14:00" }
            ],
            "B2": [
              { "startTime": "15:00", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "20:00" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "13:00", "endTime": "14:00" }
            ],
            "C2": [
              { "startTime": "15:00", "endTime": "15:25" },
              { "startTime": "15:25", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:15" },
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:00" },
              { "startTime": "20:00", "endTime": "20:25" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "13:00", "endTime": "14:00" }
            ],
            "D2": [
              { "startTime": "15:00", "endTime": "15:25" },
              { "startTime": "15:25", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:15" },
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:00" },
              { "startTime": "20:00", "endTime": "20:25" }
            ],
            "E1": [
              { "startTime": "19:00", "endTime": "21:20" }
            ],
            "E2": [
              { "startTime": "19:00", "endTime": "21:20" }
            ],
            "F1": [],
            "F2": [],
            "I": [],
            "G": [
              { "startTime": "15:00", "endTime": "15:25" },
              { "startTime": "15:25", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:15" },
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:00" },
              { "startTime": "20:00", "endTime": "20:25" }
            ],
            // "H": []
          }
        },
        "Thursday": {
          "slots": {
            "A1/A2": [
              { "startTime": "15:00", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "20:00" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" }
            ],
            "B2": [
              { "startTime": "15:00", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "20:00" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" }
            ],
            "C2": [
              { "startTime": "15:00", "endTime": "15:25" },
              { "startTime": "15:25", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:15" },
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:00" },
              { "startTime": "20:00", "endTime": "20:25" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" }
            ],
            "D2": [
              { "startTime": "15:00", "endTime": "15:25" },
              { "startTime": "15:25", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:15" },
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:00" },
              { "startTime": "20:00", "endTime": "20:25" }
            ],
            "E1": [],
            "E2": [],
            "F1": [],
            "F2": [],
            "I": [
              { "startTime": "13:00", "endTime": "14:00" }
            ],
            "G": [
              { "startTime": "15:00", "endTime": "15:25" },
              { "startTime": "15:25", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:15" },
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:00" },
              { "startTime": "20:00", "endTime": "20:25" }
            ],
            // "H": []
          }
        },
        "Friday": {
          "slots": {
            "A1/A2": [
              { "startTime": "16:30", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "19:00" },
              { "startTime": "19:00", "endTime": "19:50" },
              { "startTime": "19:50", "endTime": "20:40" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" }
            ],
            "B2": [
              { "startTime": "16:30", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "19:00" },
              { "startTime": "19:00", "endTime": "19:50" },
              { "startTime": "19:50", "endTime": "20:40" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" }
            ],
            "C2": [
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" },
              { "startTime": "18:35", "endTime": "19:00" },
              { "startTime": "19:00", "endTime": "19:25" },
              { "startTime": "19:25", "endTime": "19:50" },
              { "startTime": "19:50", "endTime": "20:15" },
              { "startTime": "20:15", "endTime": "20:40" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" }
            ],
            "D2": [
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" },
              { "startTime": "18:35", "endTime": "19:00" },
              { "startTime": "19:00", "endTime": "19:25" },
              { "startTime": "19:25", "endTime": "19:50" },
              { "startTime": "19:50", "endTime": "20:15" },
              { "startTime": "20:15", "endTime": "20:40" }
            ],
            "E1": [],
            "E2": [],
            "F1": [
              { "startTime": "15:00", "endTime": "16:15" }
            ],
            "F2": [
              { "startTime": "15:00", "endTime": "16:15" }
            ],
            "I": [
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "13:00", "endTime": "14:00" }
            ],
            "G": [
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" },
              { "startTime": "18:35", "endTime": "19:00" },
              { "startTime": "19:00", "endTime": "19:25" },
              { "startTime": "19:25", "endTime": "19:50" },
              { "startTime": "19:50", "endTime": "20:15" },
              { "startTime": "20:15", "endTime": "20:40" }
            ],
            // "H": [],

          }
        },
        "Saturday": {
          "slots": {
            "A1/A2": [],
            "B1": [],
            "B2": [],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" }
            ],
            "C2": [
              { "startTime": "14:00", "endTime": "14:25" },
              { "startTime": "14:25", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:15" },
              { "startTime": "15:15", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:30" }
            ],
            "D1": [],
            "D2": [],
            "E1": [],
            "E2": [],
            "F1": [],
            "F2": [],
            "I": [],
            "G": [],
            // "H": []
          }
        },
        "Sunday": {
          "slots": {
            "A1/A2": [],
            "B1": [],
            "B2": [],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" }
            ],
            "C2": [
              { "startTime": "14:00", "endTime": "14:25" },
              { "startTime": "14:25", "endTime": "14:50" },
              { "startTime": "14:50", "endTime": "15:15" },
              { "startTime": "15:15", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:30" }
            ],
            "D1": [],
            "D2": [],
            "E1": [],
            "E2": [],
            "F1": [],
            "F2": [],
            "I": [],
            "G": [],
            // "H": []
          }
        }
      }
    },
    "6": {
      "weeklyHours": 55,
      "monthlyTurnover": 12500,
      "totalSlots": 138,
      "defaultTimeTable": {
        "Monday": {
          "slots": {
            "A1/A2": [
              { "startTime": "16:15", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:25" },
              { "startTime": "20:25", "endTime": "21:15" },
              { "startTime": "21:15", "endTime": "22:05" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "14:00", "endTime": "15:00" },
              { "startTime": "15:00", "endTime": "16:00" }
            ],
            "B2": [
              { "startTime": "16:15", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:25" },
              { "startTime": "20:25", "endTime": "21:15" },
              { "startTime": "21:15", "endTime": "22:05" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "14:00", "endTime": "15:00" },
              { "startTime": "15:00", "endTime": "16:00" }
            ],
            "C2": [
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:00" },
              { "startTime": "20:00", "endTime": "20:25" },
              { "startTime": "20:25", "endTime": "20:50" },
              { "startTime": "20:50", "endTime": "21:15" },
              { "startTime": "21:15", "endTime": "21:40" },
              { "startTime": "21:40", "endTime": "22:05" },
              { "startTime": "22:05", "endTime": "22:30" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "14:00", "endTime": "15:00" },
              { "startTime": "15:00", "endTime": "16:00" }
            ],
            "D2": [
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:00" },
              { "startTime": "20:00", "endTime": "20:25" },
              { "startTime": "20:25", "endTime": "20:50" },
              { "startTime": "20:50", "endTime": "21:15" },
              { "startTime": "21:15", "endTime": "21:40" },
              { "startTime": "21:40", "endTime": "22:05" },
              { "startTime": "22:05", "endTime": "22:30" }
            ],
            "E1": [],
            "E2": [],
            "F1": [],
            "F2": [],
            "I": [],
            "G": [
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:00" },
              { "startTime": "20:00", "endTime": "20:25" },
              { "startTime": "20:25", "endTime": "20:50" },
              { "startTime": "20:50", "endTime": "21:15" },
              { "startTime": "21:15", "endTime": "21:40" },
              { "startTime": "21:40", "endTime": "22:05" },
              { "startTime": "22:05", "endTime": "22:30" }
            ],
            // "H": []
          }
        },
        "Tuesday": {
          "slots": {
            "A1/A2": [
              { "startTime": "16:15", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:25" },
              { "startTime": "20:25", "endTime": "21:15" },
              { "startTime": "21:15", "endTime": "22:05" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "14:00", "endTime": "15:00" },
              { "startTime": "15:00", "endTime": "16:00" }
            ],
            "B2": [
              { "startTime": "16:15", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:25" },
              { "startTime": "20:25", "endTime": "21:15" },
              { "startTime": "21:15", "endTime": "22:05" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "14:00", "endTime": "15:00" },
              { "startTime": "15:00", "endTime": "16:00" }
            ],
            "C2": [
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:00" },
              { "startTime": "20:00", "endTime": "20:25" },
              { "startTime": "20:25", "endTime": "20:50" },
              { "startTime": "20:50", "endTime": "21:15" },
              { "startTime": "21:15", "endTime": "21:40" },
              { "startTime": "21:40", "endTime": "22:05" },
              { "startTime": "22:05", "endTime": "22:30" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "14:00", "endTime": "15:00" },
              { "startTime": "15:00", "endTime": "16:00" }
            ],
            "D2": [
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:00" },
              { "startTime": "20:00", "endTime": "20:25" },
              { "startTime": "20:25", "endTime": "20:50" },
              { "startTime": "20:50", "endTime": "21:15" },
              { "startTime": "21:15", "endTime": "21:40" },
              { "startTime": "21:40", "endTime": "22:05" },
              { "startTime": "22:05", "endTime": "22:30" }
            ],
            "E1": [],
            "E2": [],
            "F1": [],
            "F2": [],
            "I": [],
            "G": [
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" },
              { "startTime": "17:55", "endTime": "18:20" },
              { "startTime": "18:20", "endTime": "18:45" },
              { "startTime": "18:45", "endTime": "19:10" },
              { "startTime": "19:10", "endTime": "19:35" },
              { "startTime": "19:35", "endTime": "20:00" },
              { "startTime": "20:00", "endTime": "20:25" },
              { "startTime": "20:25", "endTime": "20:50" },
              { "startTime": "20:50", "endTime": "21:15" },
              { "startTime": "21:15", "endTime": "21:40" },
              { "startTime": "21:40", "endTime": "22:05" },
              { "startTime": "22:05", "endTime": "22:30" }
            ],
            // "H": []
          }
        },
        "Wednesday": {
          "slots": {
            "A1/A2": [
              { "startTime": "15:15", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:45" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "14:00", "endTime": "15:00" }
            ],
            "B2": [
              { "startTime": "15:15", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:45" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "14:00", "endTime": "15:00" }
            ],
            "C2": [
              { "startTime": "15:15", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "22:00", "endTime": "22:25" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "14:00", "endTime": "15:00" }
            ],
            "D2": [
              { "startTime": "15:15", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "22:00", "endTime": "22:25" }
            ],
            "E1": [
              { "startTime": "19:00", "endTime": "21:20" }
            ],
            "E2": [
              { "startTime": "19:00", "endTime": "21:20" }
            ],
            "F1": [],
            "F2": [],
            "I": [],
            "G": [
              { "startTime": "15:15", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "22:00", "endTime": "22:25" }
            ],
            // "H": []
          }
        },
        "Thursday": {
          "slots": {
            "A1/A2": [
              { "startTime": "15:15", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:35" },
              { "startTime": "18:35", "endTime": "19:25" },
              { "startTime": "19:25", "endTime": "20:15" },
              { "startTime": "20:15", "endTime": "21:05" },
              { "startTime": "21:05", "endTime": "21:55" },
              { "startTime": "21:55", "endTime": "22:45" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "14:00", "endTime": "15:00" }
            ],
            "B2": [
              { "startTime": "15:15", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:35" },
              { "startTime": "18:35", "endTime": "19:25" },
              { "startTime": "19:25", "endTime": "20:15" },
              { "startTime": "20:15", "endTime": "21:05" },
              { "startTime": "21:05", "endTime": "21:55" },
              { "startTime": "21:55", "endTime": "22:45" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "14:00", "endTime": "15:00" }
            ],
            "C2": [
              { "startTime": "15:15", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" },
              { "startTime": "18:35", "endTime": "19:00" },
              { "startTime": "19:00", "endTime": "19:25" },
              { "startTime": "19:25", "endTime": "19:50" },
              { "startTime": "19:50", "endTime": "20:15" },
              { "startTime": "20:15", "endTime": "20:40" },
              { "startTime": "20:40", "endTime": "21:05" },
              { "startTime": "21:05", "endTime": "21:30" },
              { "startTime": "21:30", "endTime": "21:55" },
              { "startTime": "21:55", "endTime": "22:20" },
              { "startTime": "22:20", "endTime": "22:45" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "14:00", "endTime": "15:00" }
            ],
            "D2": [
              { "startTime": "15:15", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" },
              { "startTime": "18:35", "endTime": "19:00" },
              { "startTime": "19:00", "endTime": "19:25" },
              { "startTime": "19:25", "endTime": "19:50" },
              { "startTime": "19:50", "endTime": "20:15" },
              { "startTime": "20:15", "endTime": "20:40" },
              { "startTime": "20:40", "endTime": "21:05" },
              { "startTime": "21:05", "endTime": "21:30" },
              { "startTime": "21:30", "endTime": "21:55" },
              { "startTime": "21:55", "endTime": "22:20" },
              { "startTime": "22:20", "endTime": "22:45" }
            ],
            "E1": [],
            "E2": [],
            "F1": [],
            "F2": [],
            "I": [],
            "G": [
              { "startTime": "15:15", "endTime": "15:40" },
              { "startTime": "15:40", "endTime": "16:05" },
              { "startTime": "16:05", "endTime": "16:30" },
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" },
              { "startTime": "18:35", "endTime": "19:00" },
              { "startTime": "19:00", "endTime": "19:25" },
              { "startTime": "19:25", "endTime": "19:50" },
              { "startTime": "19:50", "endTime": "20:15" },
              { "startTime": "20:15", "endTime": "20:40" },
              { "startTime": "20:40", "endTime": "21:05" },
              { "startTime": "21:05", "endTime": "21:30" },
              { "startTime": "21:30", "endTime": "21:55" },
              { "startTime": "21:55", "endTime": "22:20" },
              { "startTime": "22:20", "endTime": "22:45" }
            ],
            // "H": []
          }
        },
        "Friday": {
          "slots": {
            "A1/A2": [
              { "startTime": "16:30", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "19:00" },
              { "startTime": "19:00", "endTime": "19:50" },
              { "startTime": "19:50", "endTime": "20:40" },
              { "startTime": "20:40", "endTime": "21:30" },
              { "startTime": "21:30", "endTime": "22:20" }
            ],
            "B1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "13:00", "endTime": "14:00" }
            ],
            "B2": [
              { "startTime": "16:30", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "19:00" },
              { "startTime": "19:00", "endTime": "19:50" },
              { "startTime": "19:50", "endTime": "20:40" },
              { "startTime": "20:40", "endTime": "21:30" },
              { "startTime": "21:30", "endTime": "22:20" }
            ],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "13:00", "endTime": "14:00" }
            ],
            "C2": [
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" },
              { "startTime": "18:35", "endTime": "19:00" },
              { "startTime": "19:00", "endTime": "19:25" },
              { "startTime": "19:25", "endTime": "19:50" },
              { "startTime": "19:50", "endTime": "20:15" },
              { "startTime": "20:15", "endTime": "20:40" },
              { "startTime": "20:40", "endTime": "21:05" },
              { "startTime": "21:05", "endTime": "21:30" },
              { "startTime": "21:30", "endTime": "21:55" },
              { "startTime": "21:55", "endTime": "22:20" },
              { "startTime": "22:20", "endTime": "22:45" }
            ],
            "D1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "13:00", "endTime": "14:00" }
            ],
            "D2": [
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" },
              { "startTime": "18:35", "endTime": "19:00" },
              { "startTime": "19:00", "endTime": "19:25" },
              { "startTime": "19:25", "endTime": "19:50" },
              { "startTime": "19:50", "endTime": "20:15" },
              { "startTime": "20:15", "endTime": "20:40" },
              { "startTime": "20:40", "endTime": "21:05" },
              { "startTime": "21:05", "endTime": "21:30" },
              { "startTime": "21:30", "endTime": "21:55" },
              { "startTime": "21:55", "endTime": "22:20" },
              { "startTime": "22:20", "endTime": "22:45" }
            ],
            "E1": [],
            "E2": [],
            "F1": [
              { "startTime": "15:00", "endTime": "16:15" }
            ],
            "F2": [
              { "startTime": "15:00", "endTime": "16:15" }
            ],
            "I": [],
            "G": [
              { "startTime": "16:30", "endTime": "16:55" },
              { "startTime": "16:55", "endTime": "17:20" },
              { "startTime": "17:20", "endTime": "17:45" },
              { "startTime": "17:45", "endTime": "18:10" },
              { "startTime": "18:10", "endTime": "18:35" },
              { "startTime": "18:35", "endTime": "19:00" },
              { "startTime": "19:00", "endTime": "19:25" },
              { "startTime": "19:25", "endTime": "19:50" },
              { "startTime": "19:50", "endTime": "20:15" },
              { "startTime": "20:15", "endTime": "20:40" },
              { "startTime": "20:40", "endTime": "21:05" },
              { "startTime": "21:05", "endTime": "21:30" },
              { "startTime": "21:30", "endTime": "21:55" },
              { "startTime": "21:55", "endTime": "22:20" },
              { "startTime": "22:20", "endTime": "22:45" }
            ],
            // "H": [],

          }
        },
        "Saturday": {
          "slots": {
            "A1/A2": [],
            "B1": [],
            "B2": [],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "13:00", "endTime": "14:00" }
            ],
            "C2": [
              { "startTime": "18:00", "endTime": "18:25" },
              { "startTime": "18:25", "endTime": "18:50" },
              { "startTime": "18:50", "endTime": "19:15" },
              { "startTime": "19:15", "endTime": "19:40" },
              { "startTime": "19:40", "endTime": "20:05" },
              { "startTime": "20:05", "endTime": "20:30" },
              { "startTime": "20:30", "endTime": "20:55" }
            ],
            "D1": [],
            "D2": [],
            "E1": [],
            "E2": [],
            "F1": [],
            "F2": [],
            "I": [
              { "startTime": "15:00", "endTime": "16:00" },
              { "startTime": "16:00", "endTime": "17:00" },
              { "startTime": "17:00", "endTime": "18:00" }
            ],
            "G": [],
            // "H": []
          }
        },
        "Sunday": {
          "slots": {
            "A1/A2": [],
            "B1": [],
            "B2": [],
            "C1": [
              { "startTime": "08:00", "endTime": "09:00" },
              { "startTime": "09:00", "endTime": "10:00" },
              { "startTime": "10:00", "endTime": "11:00" },
              { "startTime": "11:00", "endTime": "12:00" },
              { "startTime": "12:00", "endTime": "13:00" },
              { "startTime": "13:00", "endTime": "14:00" }
            ],
            "C2": [
              { "startTime": "15:00", "endTime": "15:25" },
              { "startTime": "15:25", "endTime": "15:50" },
              { "startTime": "15:50", "endTime": "16:15" },
              { "startTime": "16:15", "endTime": "16:40" },
              { "startTime": "16:40", "endTime": "17:05" },
              { "startTime": "17:05", "endTime": "17:30" },
              { "startTime": "17:30", "endTime": "17:55" }
            ],
            "D1": [],
            "D2": [],
            "E1": [],
            "E2": [],
            "F1": [],
            "F2": [],
            "I": [],
            "G": [],
            // "H": []
          }
        }
      }
    }



  },
}

interface Service {
  ESSENTIAL: string[];
  PRO: string[];
  ADVANCED: string[];
  ULTIMATE: string[];
}

export const SERVICES: Service = {
  "ESSENTIAL": ["A1/A2", "B1", "B2", "C1", "C2", "D1", "D2", "G"],
  "PRO": ["A1/A2", "B1", "B2", "C1", "C2", "D1", "D2", "E1", "E2", "F1", "F2", "G"],
  "ADVANCED": ["A1/A2", "B1", "B2", "C1", "C2", "D1", "D2", "G", "I"],
  "ULTIMATE": ["A1/A2", "B1", "B2", "C1", "C2", "D1", "D2", "E1", "E2", "F1", "F2", "G", "I"],
}

// Service color mapping
export const SERVICE_COLORS: Record<string, string> = {
  "A1/A2": "bg-blue-500",
  B1: "bg-purple-500",
  B2: "bg-pink-500",
  C1: "bg-red-600",
  C2: "bg-orange-500",
  D1: "bg-yellow-600",
  D2: "bg-amber-500",
  E1: "bg-indigo-600",
  E2: "bg-indigo-400",
  F1: "bg-purple-700",
  F2: "bg-purple-400",
  G: "bg-gray-600",
  H: "bg-slate-600",
  I: "bg-emerald-600",
}

// Ensure all colors are available for Tailwind
export const TAILWIND_COLORS = [
  "bg-blue-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-red-600",
  "bg-orange-500",
  "bg-yellow-600",
  "bg-amber-500",
  "bg-indigo-600",
  "bg-indigo-400",
  "bg-purple-700",
  "bg-purple-400",
  "bg-gray-600",
  "bg-slate-600",
  "bg-emerald-600",
]

export interface ServiceData {
  id: string
  title: string
  description: string
  serviceType: string
  duration?: string
}

export const DEFAULT_SERVICES: Record<string, ServiceData> = {
  "A1/A2": {
    id: "A1/A2",
    title: "Onboarding Meeting",
    description: "Initial consultation and onboarding process",
    serviceType: "Consultation",
    duration: "50 min",
  },
  B1: {
    id: "B1",
    title: "Pre Birth Consultation Visit",
    description: "In-person pregnancy care consultation",
    serviceType: "Pregnancy Care",
    duration: "60 min",
  },
  B2: {
    id: "B2",
    title: "Pre Birth Consultation Video",
    description: "Video pregnancy care consultation",
    serviceType: "Pregnancy Care",
    duration: "50 min",
  },
  C1: {
    id: "C1",
    title: "After Birth Intense Care Visit",
    description: "In-person early postpartum care",
    serviceType: "Early Postpartum",
    duration: "60 min",
  },
  C2: {
    id: "C2",
    title: "After Birth Intense Care Video",
    description: "Video early postpartum care",
    serviceType: "Early Postpartum",
    duration: "25 min",
  },
  D1: {
    id: "D1",
    title: "After Birth Child Support Visit",
    description: "In-person late postpartum care",
    serviceType: "Late Postpartum",
    duration: "60 min",
  },
  D2: {
    id: "D2",
    title: "After Birth Child Support Video",
    description: "Video late postpartum care",
    serviceType: "Late Postpartum",
    duration: "25 min",
  },
  E1: {
    id: "E1",
    title: "Birth Training Class",
    description: "Birth preparation course",
    serviceType: "Course",
    duration: "140 min",
  },
  E2: {
    id: "E2",
    title: "Birth Training Video",
    description: "Birth preparation video session",
    serviceType: "Course",
    duration: "140 min",
  },
  F1: {
    id: "F1",
    title: "After Birth Gym",
    description: "Postpartum fitness course",
    serviceType: "Course",
    duration: "75 min",
  },
  F2: {
    id: "F2",
    title: "After Birth Gym Video",
    description: "Postpartum fitness video session",
    serviceType: "Course",
    duration: "75 min",
  },
  G: {
    id: "G",
    title: "Emergency First Monitor",
    description: "Emergency monitoring service",
    serviceType: "Emergency",
    duration: "25 min",
  },
  H: {
    id: "H",
    title: "Emergency Time Blocker",
    description: "Emergency time slot reservation",
    serviceType: "Emergency",
    duration: "60 min",
  },
  I: {
    id: "I",
    title: "Private Services",
    description: "Private consultation services",
    serviceType: "Private",
    duration: "60 min",
  },
}



export const SERVICES_DURATIONS = [
  { id: "A1/A2", duration: 50 },
  { id: "B1", duration: 60 },
  { id: "B2", duration: 50 },
  { id: "C1", duration: 60 },
  { id: "C2", duration: 25 },
  { id: "D1", duration: 60 },
  { id: "D2", duration: 25 },
  { id: "E1", duration: 140 },
  { id: "E2", duration: 140 },
  { id: "F1", duration: 75 },
  { id: "F2", duration: 75 },
  { id: "G", duration: 25 },
  { id: "H", duration: 60 },
  { id: "I", duration: 60 },
]


// export const SERVICES_DURATIONS = [
//   { id: "A1/A2", duration: 60 },
//   { id: "B1", duration: 60 },
//   { id: "B2", duration: 45 },
//   { id: "C1", duration: 60 },
//   { id: "C2", duration: 25 },
//   { id: "D1", duration: 60 },
//   { id: "D2", duration: 25 },
//   { id: "E1", duration: 140 },
//   { id: "E2", duration: 45 },
//   { id: "F1", duration: 75 },
//   { id: "F2", duration: 45 },
//   { id: "G", duration: 30 },
//   { id: "H", duration: 60 },
//   { id: "I", duration: 60 },
// ] 