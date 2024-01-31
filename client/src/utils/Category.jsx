import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

const fetchCategories = async () => {
  try {
    const { data: allCategories } = await axiosInstance.get('/categories');
    const categoriesWithPostCount = await Promise.all(
      allCategories.map(async (category) => {
        const {
          data: { posts },
        } = await axiosInstance.get(`/categories/${category._id}`);
        return { ...category, postCount: posts.length };
      })
    );

    const filteredCategories = categoriesWithPostCount.filter(
      (category) => category.postCount > 0
    );
    return filteredCategories;
  } catch (error) {
    console.log(error.message);
  }
};

export default fetchCategories;
