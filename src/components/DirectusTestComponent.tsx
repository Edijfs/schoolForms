import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'https://directus.fcpro-school.com';
const API_TOKEN = 'I9e3N08fhl1NtwIZFuU5W2KFfzwXLYMu';

const DirectusTestComponent = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/items/contactos`, {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
      });
      setData(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/items/contactos`, formData, {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
      });
      // Clear form data after successful submission
      setFormData({
        nome: '',
        email: '',
      });
      // Refetch data to update the list
      fetchData();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Directus API Test</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>

      <h3>Send Data to Directus</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nome">Nome:</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default DirectusTestComponent;