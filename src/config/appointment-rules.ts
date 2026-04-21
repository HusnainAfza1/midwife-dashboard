import type { AppointmentRule } from "@/types/simulations"

export const APPOINTMENT_RULES: Record<string, AppointmentRule> = {
  // Pregnancy Care - B1/B2
  B1: {
    code: "B1",
    title: "Pre Birth Consultation Visit",
    duration: 60,
    color: "bg-purple-500",
    type: "pregnancy",
    rules: {
      startOffset: -180, // ET - 6 months
      endOffset: -30, // ET - 1 month
      maxPerDay: 1,
      weekdaysOnly: true,
      gapBetweenSame: { min: 14, max: 42 },
      slotsPerMonth: 1, // Exactly 1 slot per calendar month
      totalQuota: 6, // 3 visits + 3 videos total
      alternateWith: "B2",
      mustStartWith: true, // Series should start with B1
    },
  },
  B2: {
    code: "B2",
    title: "Pre Birth Consultation Video",
    duration: 45,
    color: "bg-pink-500", // Changed to more readable color
    type: "pregnancy",
    rules: {
      startOffset: -180,
      endOffset: -30,
      maxPerDay: 1,
      weekdaysOnly: true,
      gapBetweenSame: { min: 14, max: 42 },
      slotsPerMonth: 1,
      totalQuota: 6,
      alternateWith: "B1",
    },
  },

  // Post-partum Early - C1/C2
  C1: {
    code: "C1",
    title: "After Birth Intense Care Visit",
    duration: 60,
    color: "!bg-orange-500",
    type: "early",
    rules: {
      startOffset: 0, // Starting on ET
      endOffset: 9, // 10 consecutive days
      maxPerDay: 1,
      maxTotal: 10,
      mustBeFirst: true, // First appointment MUST be C1
      canCombineWith: ["C2"],
      weekendsAllowed: true, // Sat/Sun reserved for intense care
      consecutiveDays: true,
    },
  },
  C2: {
    code: "C2",
    title: "After Birth Intense Care Video",
    duration: 25,
    color: "bg-orange-500", // Changed to more readable color
    type: "early",
    rules: {
      startOffset: 0,
      endOffset: 9,
      maxPerDay: 1,
      maxTotal: 10,
      canCombineWith: ["C1"],
      weekendsAllowed: true,
      consecutiveDays: true,
    },
  },

  // Post-partum Late - D1/D2
  D1: {
    code: "D1",
    title: "After Birth Child Support Visit",
    duration: 60,
    color: "bg-yellow-600",
    type: "late",
    rules: {
      startOffset: 11, // ET + 11 days
      endOffset: 84, // ET + 12 weeks
      maxPerDay: 1,
      weekdaysOnly: true,
      gapBetweenSame: { min: 2, max: 999 }, // ≥ 30 hours gap (≥ 2 days)
      slotsPerWeek: [
        { weeks: "3-8", count: 2 }, // Weeks 3-8: 2 slots per week
        { weeks: "9-12", count: 1 }, // Weeks 9-12: 1 slot per week
      ],
      totalQuota: 16, // 8 visits + 8 videos
      alternateWith: "D2",
    },
  },
  D2: {
    code: "D2",
    title: "After Birth Child Support Video",
    duration: 25,
    color: "bg-amber-500",
    type: "late",
    rules: {
      startOffset: 11,
      endOffset: 84,
      maxPerDay: 1,
      weekdaysOnly: true,
      gapBetweenSame: { min: 2, max: 999 },
      slotsPerWeek: [
        { weeks: "3-8", count: 2 },
        { weeks: "9-12", count: 1 },
      ],
      totalQuota: 16,
      alternateWith: "D1",
    },
  },

  // Courses
  E1: {
    code: "E1",
    title: "Birth Training Class",
    duration: 140, // 2h 20min
    color: "bg-indigo-600",
    type: "course",
    rules: {
      startOffset: -84, // ET - 12 weeks (max)
      endOffset: -28, // ET - 4 weeks (min)
      courseSize: 10, // Max 10 clients per course
      courseSessions: 6, // 6 appointments per client
      weekdaysOnly: true,
    },
  },
  F1: {
    code: "F1",
    title: "After Birth Gym",
    duration: 75, // 1h 15min
    color: "bg-purple-700",
    type: "course",
    rules: {
      startOffset: 56, // ET + 8 weeks
      endOffset: 365, // Can be scheduled far in advance
      courseSize: 10, // Max 10 clients per course
      courseSessions: 8, // 8 appointments per client
      weekdaysOnly: true,
    },
  },
}
