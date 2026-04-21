export type Skill = {
  rank: number;
  name: string;
  category: string;
  junior: number;
  middle: number;
  senior: number;
  jobs: number;
  delta: number;
  spark: number[];
};

export const SKILLS: Skill[] = [
  { rank: 1,  name: "TypeScript", category: "Lang",     junior: 380, middle: 620,  senior: 1050, jobs: 2140, delta: 31.4, spark: [4,5,6,7,8,9,10,12,13,15,16,18] },
  { rank: 2,  name: "React",      category: "Frontend", junior: 370, middle: 640,  senior: 1100, jobs: 1980, delta: 24.1, spark: [6,7,7,8,9,10,11,11,12,13,14,15] },
  { rank: 3,  name: "Python",     category: "Lang",     junior: 320, middle: 560,  senior: 980,  jobs: 1760, delta: 12.3, spark: [9,9,10,10,11,11,11,12,12,12,13,13] },
  { rank: 4,  name: "Go",         category: "Lang",     junior: 520, middle: 820,  senior: 1400, jobs: 840,  delta: 42.0, spark: [3,4,5,6,7,8,10,11,13,15,17,20] },
  { rank: 5,  name: "Kubernetes", category: "DevOps",   junior: 580, middle: 920,  senior: 1500, jobs: 620,  delta: 48.7, spark: [2,3,4,5,6,7,9,11,13,15,18,21] },
  { rank: 6,  name: "Node.js",    category: "Backend",  junior: 360, middle: 620,  senior: 1020, jobs: 1240, delta: 18.6, spark: [7,8,8,9,9,10,10,11,12,12,13,14] },
  { rank: 7,  name: "PostgreSQL", category: "Data",     junior: 340, middle: 580,  senior: 990,  jobs: 1390, delta: 9.1,  spark: [10,10,11,11,11,12,12,12,12,13,13,13] },
  { rank: 8,  name: "Java",       category: "Lang",     junior: 410, middle: 720,  senior: 1180, jobs: 980,  delta: 4.2,  spark: [12,12,12,12,12,13,12,13,13,13,13,13] },
  { rank: 9,  name: "Rust",       category: "Lang",     junior: 640, middle: 1050, senior: 1750, jobs: 180,  delta: 61.8, spark: [1,1,2,2,3,4,5,7,9,12,15,19] },
  { rank: 10, name: "Terraform",  category: "DevOps",   junior: 520, middle: 880,  senior: 1420, jobs: 310,  delta: 36.5, spark: [3,4,5,6,7,8,9,11,12,14,16,18] },
];
