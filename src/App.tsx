import { useState } from "react";
import axios from "axios";
import ContactForm from "./components/ContactForm";
import StudentForm from "./components/StudentForm";
import OrderForm from "./components/OrderForm";

// Create axios instance
const api = axios.create({
  baseURL: "https://directus.fcpro-school.com/items",
  headers: {
    "Content-Type": "application/json",
  },
});


export default function App() {
  const [currentForm, setCurrentForm] = useState<"contact" | "student" | "order">("contact");
  const [formData, setFormData] = useState({
    contact: {},
    student: {},
    order: {},
  });

  const handleContactSubmit = async (contactData: any) => {
    setFormData((prev) => ({
      ...prev,
      contact: contactData,
    }));
    setCurrentForm("student");
  };

  const handleStudentSubmit = async (studentData: any) => {
    setFormData((prev) => ({
      ...prev,
      student: studentData,
    }));
    setCurrentForm("order");
  };

  const handleOrderSubmit = async (orderData: any) => {
    const finalData = {
      ...formData.contact,
      ...formData.student,
      ...orderData,
    };

    try {
      const response = await api.post("/orders", finalData);
      console.log("Order submitted successfully:", response.data);
      // Handle success (e.g., show success message, reset forms)
    } catch (error) {
      console.error("Error submitting order:", error);
      throw error; // This will be caught by the OrderForm component
    }
  };

  return (
    <>
      {currentForm === "contact" && <ContactForm onSubmit={handleContactSubmit} />}
      {currentForm === "student" && <StudentForm onSubmit={handleStudentSubmit} />}
      {currentForm === "order" && <OrderForm onSubmit={handleOrderSubmit} />}
    </>
  );
}