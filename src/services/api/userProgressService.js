// Mock local storage for user progress
const STORAGE_KEY = 'courseflow_user_progress';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getStorageData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const setStorageData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save progress:', error);
  }
};

const userProgressService = {
  async getAllProgress() {
    await delay(250);
    return [...getStorageData()];
  },

  async getProgress(courseId) {
    await delay(200);
    const allProgress = getStorageData();
    return allProgress.find(p => p.courseId === courseId) || null;
  },

  async enroll(courseId) {
    await delay(300);
    const allProgress = getStorageData();
    const existingProgress = allProgress.find(p => p.courseId === courseId);
    
    if (existingProgress) {
      return { ...existingProgress };
    }

    const newProgress = {
      courseId,
      completedLessons: [],
      quizScores: {},
      lastAccessed: new Date().toISOString(),
      certificateEarned: false
    };

    allProgress.push(newProgress);
    setStorageData(allProgress);
    return { ...newProgress };
  },

  async updateProgress(courseId, { lessonId, progress }) {
    await delay(200);
    const allProgress = getStorageData();
    const index = allProgress.findIndex(p => p.courseId === courseId);
    
    if (index === -1) {
      await this.enroll(courseId);
      return this.updateProgress(courseId, { lessonId, progress });
    }

    allProgress[index].lastAccessed = new Date().toISOString();
    setStorageData(allProgress);
    return { ...allProgress[index] };
  },

  async completeLesson(courseId, lessonId) {
    await delay(250);
    const allProgress = getStorageData();
    const index = allProgress.findIndex(p => p.courseId === courseId);
    
    if (index === -1) {
      throw new Error('Progress not found');
    }

    if (!allProgress[index].completedLessons.includes(lessonId)) {
      allProgress[index].completedLessons.push(lessonId);
    }
    
    allProgress[index].lastAccessed = new Date().toISOString();
    setStorageData(allProgress);
    return { ...allProgress[index] };
  },

  async completeQuiz(courseId, lessonId, score) {
    await delay(300);
    const allProgress = getStorageData();
    const index = allProgress.findIndex(p => p.courseId === courseId);
    
    if (index === -1) {
      throw new Error('Progress not found');
    }

    allProgress[index].quizScores[lessonId] = score;
    allProgress[index].lastAccessed = new Date().toISOString();
    setStorageData(allProgress);
    return { ...allProgress[index] };
  },

  async earnCertificate(courseId) {
    await delay(200);
    const allProgress = getStorageData();
    const index = allProgress.findIndex(p => p.courseId === courseId);
    
    if (index === -1) {
      throw new Error('Progress not found');
    }

    allProgress[index].certificateEarned = true;
    allProgress[index].lastAccessed = new Date().toISOString();
    setStorageData(allProgress);
    return { ...allProgress[index] };
  }
};

export default userProgressService;