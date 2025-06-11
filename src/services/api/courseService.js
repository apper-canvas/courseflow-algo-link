import courseData from '../mockData/courses.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const courseService = {
  async getAll() {
    await delay(300);
    return [...courseData];
  },

  async getById(id) {
    await delay(200);
    const course = courseData.find(c => c.id === id);
    if (!course) {
      throw new Error('Course not found');
    }
    return { ...course };
  },

  async create(course) {
    await delay(400);
    const newCourse = {
      ...course,
      id: `course-${Date.now()}`,
    };
    courseData.push(newCourse);
    return { ...newCourse };
  },

  async update(id, updates) {
    await delay(350);
    const index = courseData.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Course not found');
    }
    courseData[index] = { ...courseData[index], ...updates };
    return { ...courseData[index] };
  },

  async delete(id) {
    await delay(300);
    const index = courseData.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Course not found');
    }
    courseData.splice(index, 1);
    return { success: true };
  }
};

export default courseService;