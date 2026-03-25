//data/machines.js

/*
  Ab Crunch Machine
  Adjustable Pulley Machine
  Bench Press
  Chest Press
  Hack Squat
  Hip Abduction Machine
  Lat Pulldown
  Leg Extensions
  Lying Leg Curl
  Triceps Extension
*/

export const MACHINES = [
  {
    id: "Ab Crunch Machine",
    name: "AB CRUNCH MACHINE",
    muscle_groups: ["Abs"],
    video_loc: "https://res.cloudinary.com/ddhy8iyig/video/upload/v1772577117/ab_crunch_gmkzew.mp4",
    description: "Sit on the machine and select a weight. Grip the handles and crunch forward, engaging your abs. Slowly return to the starting position."
  },
  {
    id: "Adjustable Pulley Machine",
    name: "ADJUSTABLE PULLEY",
    muscle_groups: ["Chest", "Shoulders"],
    image_loc: require("../assets/images/cable_crossover.jpg"),
    description: "This machine has two adjustable pulleys. With these pulleys you can perform a variety of exercises depending on the height and angle you set the pulleys at."
  },
  {
    id: "Bench Press",
    name: "BENCH PRESS",
    muscle_groups: ["Chest", "Triceps", "Shoulders"],
    video_loc: "https://res.cloudinary.com/ddhy8iyig/video/upload/v1772577074/bench_press_vfzqkf.mp4",
    description: "Lie on the bench with feet flat on the floor. Grip the barbell slightly wider than shoulder-width. Lower the bar to your chest, then press it back up."
  },
  {
    id: "Chest Press Machine",
    name: "CHEST PRESS MACHINE",
    muscle_groups: ["Chest", "Triceps"],
    video_loc: "https://res.cloudinary.com/ddhy8iyig/video/upload/v1771969351/chest_press_dbrib9.mp4",
    description: "Sit and grip the handles at chest level. Press forward until arms are extended, keeping your back flat against the pad. Slowly return to start."
  },
  {
    id: "Hack Squat Machine",
    name: "HACK SQUAT",
    muscle_groups: ["Quads", "Hamstrings", "Glutes"],
    video_loc: "https://res.cloudinary.com/ddhy8iyig/video/upload/v1772577563/hack_squat_gglzrt.mp4",
    description: "Stand on the platform with shoulders under the pads. Lower your body by bending your knees until thighs are parallel to the platform, then press back up."
  },
  {
    id: "Hip Abduction Machine",
    name: "HIP ABDUCTION MACHINE",
    muscle_groups: ["Outer Thighs", "Glutes"],
    video_loc: "https://res.cloudinary.com/ddhy8iyig/video/upload/v1772577745/hip_abduction_bdjuud.mp4",
    description: "Sit on the machine with legs together and select a weight. Push your legs apart against the resistance, then slowly return to the starting position."
  },
  {
    id: "Lat Pulldown Machine",
    name: "LAT PULLDOWN",
    muscle_groups: ["Lats", "Back", "Biceps"],
    video_loc: "https://res.cloudinary.com/ddhy8iyig/video/upload/v1771968213/cable_lat_pulldown_ij50xe.mp4",
    description: "Seated machine with thigh pads. Pull the bar down to your collarbone, squeezing your shoulder blades together."
  },
  {
    id: "Leg Extension Machine",
    name: "LEG EXTENSION",
    muscle_groups: ["Quads"],
    video_loc: "https://res.cloudinary.com/ddhy8iyig/video/upload/v1771968257/leg_extension_or6ti5.mp4",
    description: "Sit with back against pad and feet under the roller. Extend your legs until they are straight, then slowly lower back down."
  },
  {
    id: "Lying Leg Curl Machine",
    name: "LYING LEG CURL",
    muscle_groups: ["Hamstrings"],
    video_loc: "https://res.cloudinary.com/ddhy8iyig/video/upload/v1772577798/lying_leg_curl_ixomr6.mp4",
    description: "Lie face down on the machine with ankles under the roller. Curl your legs up towards your glutes, then slowly lower back down."
  },
  {
    id: "Triceps Extension Machine",
    name: "TRICEPS EXTENSION",
    muscle_groups: ["Triceps"],
    video_loc: "https://res.cloudinary.com/ddhy8iyig/video/upload/v1772577826/tricep_extension_fg2kua.mp4",
    description: "Sit with back against pad and grip handles above your head. Extend your arms upward until they are straight, then slowly return to the starting position."
  }
];