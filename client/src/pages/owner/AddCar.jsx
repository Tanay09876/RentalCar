import React, { useState } from "react";
import Title from "../../components/owner/Title";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const AddCar = () => {
  const { axios, currency } = useAppContext();

  const [image, setImage] = useState(null);
  const [rcDocument, setRcDocument] = useState(null);
  const [step, setStep] = useState(1);
  const [car, setCar] = useState({
    brand: "",
    model: "",
    year: "",
    pricePerDay: "",
    category: "",
    transmission: "",
    fuel_type: "",
    seating_capacity: "",
    location: "",
    description: "",
    registrationNumber: "",
    insuranceNumber: "",
    insuranceExpiry: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleNext = () => {
    if (
      !car.brand ||
      !car.model ||
      !car.year ||
      !car.pricePerDay ||
      !car.category ||
      !car.transmission ||
      !car.fuel_type ||
      !car.seating_capacity ||
      !car.location ||
      !car.description
    ) {
      toast.error("Please fill in all car specifications.");
      return;
    }
    if (!image) {
      toast.error("Please upload a picture of your car.");
      return;
    }
    setStep(2);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!image) {
      toast.error("Please upload a picture of the car.");
      return;
    }
    if (!rcDocument) {
      toast.error("Please upload the Registration Certificate (RC) document file.");
      return;
    }
    if (isLoading) return null;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("rcDocument", rcDocument);
      formData.append("carData", JSON.stringify(car));

      const { data } = await axios.post("/api/owner/add-car", formData);

      if (data.success) {
        toast.success(data.message);
        setImage(null);
        setRcDocument(null);
        setStep(1);
        setCar({
          brand: "",
          model: "",
          year: "",
          pricePerDay: "",
          category: "",
          transmission: "",
          fuel_type: "",
          seating_capacity: "",
          location: "",
          description: "",
          registrationNumber: "",
          insuranceNumber: "",
          insuranceExpiry: "",
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-4 py-10 md:px-10 flex-1 max-w-2xl">
      <Title
        title="Add New Car"
        subTitle="Fill in details to list a new car for booking, including pricing, availability, and car specifications."
      />

      {/* Step Indicator */}
      <div className="flex gap-4 items-center mb-8 mt-6 text-sm">
        <div className={`flex items-center gap-2 font-medium ${step === 1 ? "text-primary" : "text-gray-400"}`}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === 1 ? "bg-primary text-white" : "bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400"}`}>1</span>
          Specifications
        </div>
        <div className="w-10 h-0.5 bg-gray-200 dark:bg-gray-800"></div>
        <div className={`flex items-center gap-2 font-medium ${step === 2 ? "text-primary" : "text-gray-400"}`}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === 2 ? "bg-primary text-white" : "bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400"}`}>2</span>
          Legal Documents
        </div>
      </div>

      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col gap-5 text-gray-500 text-sm mt-2"
      >
        {step === 1 && (
          <>
            {/* Car Image */}
            <div className="flex items-center gap-2 w-full">
              <label htmlFor="car-image">
                <img
                  src={image ? URL.createObjectURL(image) : assets.upload_icon}
                  alt=""
                  className="h-14 rounded cursor-pointer"
                />
                <input
                  type="file"
                  id="car-image"
                  accept="image/*"
                  hidden
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </label>
              <p className="text-sm text-gray-500">Upload a picture of your car</p>
            </div>

            {/* Car Brand & Model */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col w-full">
                <label>Brand</label>
                <input
                  type="text"
                  placeholder="e.g. BMW, Mercedes, Audi..."
                  className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none text-black dark:text-white"
                  value={car.brand}
                  onChange={(e) => setCar({ ...car, brand: e.target.value })}
                />
              </div>
              <div className="flex flex-col w-full">
                <label>Model</label>
                <input
                  type="text"
                  placeholder="e.g. X5, E-Class, M4..."
                  className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none text-black dark:text-white"
                  value={car.model}
                  onChange={(e) => setCar({ ...car, model: e.target.value })}
                />
              </div>
            </div>

            {/* Car Year, Price, Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div className="flex flex-col w-full">
                <label>Year</label>
                <input
                  type="number"
                  placeholder="2025"
                  min="1900"
                  className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none text-black dark:text-white"
                  value={car.year}
                  onChange={(e) => setCar({ ...car, year: e.target.value })}
                />
              </div>
              <div className="flex flex-col w-full">
                <label>Daily Price ({currency})</label>
                <input
                  type="number"
                  placeholder="100"
                  min="1"
                  className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none text-black dark:text-white"
                  value={car.pricePerDay}
                  onChange={(e) => setCar({ ...car, pricePerDay: e.target.value })}
                />
              </div>
              <div className="flex flex-col w-full">
                <label>Category</label>
                <select
                  onChange={(e) => setCar({ ...car, category: e.target.value })}
                  value={car.category}
                  className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none bg-white dark:bg-gray-800 text-black dark:text-white"
                >
                  <option value="">Select a category</option>
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Van">Van</option>
                </select>
              </div>
            </div>

            {/* Car Transmission, Fuel Type, Seating Capacity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div className="flex flex-col w-full">
                <label>Transmission</label>
                <select
                  onChange={(e) => setCar({ ...car, transmission: e.target.value })}
                  value={car.transmission}
                  className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none bg-white dark:bg-gray-800 text-black dark:text-white"
                >
                  <option value="">Select a transmission</option>
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                  <option value="Semi-Automatic">Semi-Automatic</option>
                </select>
              </div>
              <div className="flex flex-col w-full">
                <label>Fuel Type</label>
                <select
                  onChange={(e) => setCar({ ...car, fuel_type: e.target.value })}
                  value={car.fuel_type}
                  className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none bg-white dark:bg-gray-800 text-black dark:text-white"
                >
                  <option value="">Select a fuel type</option>
                  <option value="Gas">Gas</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
              <div className="flex flex-col w-full">
                <label>Seating Capacity</label>
                <input
                  type="number"
                  placeholder="4"
                  min="1"
                  className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none text-black dark:text-white"
                  value={car.seating_capacity}
                  onChange={(e) =>
                    setCar({ ...car, seating_capacity: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Car Location */}
            <div className="flex flex-col w-full">
              <label>Location</label>
              <select
                onChange={(e) => setCar({ ...car, location: e.target.value })}
                value={car.location}
                className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none bg-white dark:bg-gray-800 text-black dark:text-white"
              >
                <option value="">Select a location</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Chennai">Chennai</option>
                <option value="Kolkata">Kolkata</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Pune">Pune</option>
                <option value="Ahmedabad">Ahmedabad</option>
              </select>
            </div>

            {/* Car Description */}
            <div className="flex flex-col w-full">
              <label>Description</label>
              <textarea
                rows={4}
                placeholder="e.g. A luxurious SUV with a spacious interior and a powerful engine."
                className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none text-black dark:text-white"
                value={car.description}
                onChange={(e) => setCar({ ...car, description: e.target.value })}
              ></textarea>
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2.5 mt-4 bg-primary text-white rounded-md font-medium w-max cursor-pointer hover:bg-primary-dull transition-all"
            >
              Next Step
            </button>
          </>
        )}

        {step === 2 && (
          <>
            {/* Registration Certificate Details */}
            <div className="flex flex-col w-full">
              <label>Registration Certificate (RC) Number</label>
              <input
                type="text"
                placeholder="e.g. MH12AB1234"
                className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none text-black dark:text-white"
                value={car.registrationNumber}
                onChange={(e) => setCar({ ...car, registrationNumber: e.target.value })}
                required
              />
            </div>

            {/* Insurance details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col w-full">
                <label>Insurance Policy Number</label>
                <input
                  type="text"
                  placeholder="e.g. POL1234567"
                  className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none text-black dark:text-white"
                  value={car.insuranceNumber}
                  onChange={(e) => setCar({ ...car, insuranceNumber: e.target.value })}
                  required
                />
              </div>
              <div className="flex flex-col w-full">
                <label>Insurance Expiry Date</label>
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none text-black dark:text-white dark:accent-white"
                  value={car.insuranceExpiry}
                  onChange={(e) => setCar({ ...car, insuranceExpiry: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* RC Document Copy File Upload */}
            <div className="flex flex-col w-full mt-2">
              <label>Upload RC Copy (Image or PDF)</label>
              <div className="flex items-center gap-3 mt-2">
                <label
                  htmlFor="rc-doc-file"
                  className="px-4 py-3 border border-dashed border-borderColor dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 text-xs text-gray-600 dark:text-gray-400 font-medium"
                >
                  {rcDocument ? rcDocument.name : "Select RC Document File"}
                </label>
                <input
                  type="file"
                  id="rc-doc-file"
                  accept="image/*,application/pdf"
                  hidden
                  onChange={(e) => setRcDocument(e.target.files[0])}
                />
                {rcDocument && <p className="text-xs text-green-500 font-medium">✓ File selected</p>}
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-6 py-2.5 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-md font-medium cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-750 transition-all text-xs"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-md font-medium cursor-pointer hover:bg-primary-dull transition-all text-xs"
              >
                <img src={assets.tick_icon} alt="" />
                {isLoading ? "Submitting..." : "List Your Car"}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default AddCar;
