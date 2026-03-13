import React from "react";
import {
  useForm,
  Controller,
  useFieldArray,
 type SubmitHandler,
} from "react-hook-form";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

import simulatedApi from "../api/index.tsx"
import type { FormData } from "../config.ts/index.tsx";

const ReactHookForm: React.FC = () => {
  const {
    control,
    register,
    handleSubmit,
    // setValue,
    setError,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      age: 18,
      gender: "",
      address: { city: "", state: "" },
      hobbies: [{ name: "" }],
      startDate: new Date(),
      subscribe: false,
      referral: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "hobbies",
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    // setError("");
    try {
      const response = await simulatedApi(data);
      console.log("Success:", response);
      // Handle success (e.g., show a success message, redirect, etc.)
    } catch (error: any) {
      console.error("Error:", error);
      setError("root", {
        message: error.message,
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white shadow-lg rounded-xl p-8 w-full max-w-xl space-y-6"
    >
      <div>
        <label className=" block font-medium mb-1">First Name</label>
        <input className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-400"
          {...register("firstName", { required: "First Name is required" })}
        />
        {errors.firstName && (
          <p className="text-red-500 text-sm">{errors.firstName.message}</p>
        )}
      </div>

      <div>
        <label  className="block font-medium mb-1">Last Name</label>
        <input  className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-400"
          {...register("lastName", { required: "Last Name is required" })}
        />
        {errors.lastName && (
          <p className="text-red-500 text-sm">{errors.lastName.message}</p>
        )}
      </div>

      <div>
        <label  className="block font-medium mb-1">Email</label>
        <input  className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-400"
          {...register("email", {
            required: "Email is required",
            pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" },
          })}
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label  className="block font-medium mb-1">Age</label>
        <input  className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-400"
          type="number"
          {...register("age", {
            required: "Age is required",
            min: { value: 18, message: "You must be at least 18 years old" },
          })}
        />
        {errors.age && (
          <p className="text-red-500 text-sm">{errors.age.message}</p>
        )}
      </div>

      <div>
        <label  className="block font-medium mb-1">Gender</label>
        <select {...register("gender", { required: "Gender is required" })}>
          <option value="">Select...</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        {errors.gender && (
          <p className="text-red-500 text-sm">{errors.gender.message}</p>
        )}
      </div>

      <div>
        <label  className="block font-medium mb-1">Address</label>
         <div className="grid grid-cols-2 gap-3" >
        <input  className="border rounded-md p-2"
          {...register("address.city", { required: "City is required" })}
          placeholder="City"
        />
        {errors.address?.city && (
          <p className="text-red-500 text-sm">{errors.address.city.message}</p>
        )}

        <input  className="border rounded-md p-2"
          {...register("address.state", { required: "State is required" })}
          placeholder="State"
        />
        {errors.address?.state && (
          <p className="text-red-500 text-sm">{errors.address.state.message}</p>
        )}</div>
      </div>

      <div>
        <label  className="block font-medium mb-1">Start Date</label>
        {/* Useful for external libraries, can be replaced with useController */}
        {/* <Controller
          control={control}
          name="startDate"
          render={({ field }) => (
            <DatePicker
              placeholderText="Select date"
              onChange={(date: Date | null) => field.onChange(date)}
              selected={field.value}
            />
          )}
        /> */}
      </div>

      <div>
        <label  className="block font-medium mb-2">Hobbies</label>
        {fields.map((item, index) => (
          <div key={item.id} className="flex gap-2 mb-2">
            <input  className="border rounded-md p-2 flex-1"
              {...register(`hobbies.${index}.name`, {
                required: "Hobby name is required",
              })}
              placeholder="Hobby Name"
            />
            {errors.hobbies?.[index]?.name && (
              <p className="text-red-500 text-sm">
                {errors.hobbies[index].name.message}
              </p>
            )}

            {fields.length > 1 && (
              <button type="button" onClick={() => remove(index)} className="bg-red-500 text-white px-2 py-1 rounded-md mt-2">
                Remove 
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={() => append({ name: "" })} className="bg-green-500 text-white px-2 py-1 rounded-md mt-2">
          Add Hobby
        </button>
      </div>

      <div className="flex">
        <label  className="block font-medium mb-1" htmlFor="sub">Subscribe to Newsletter</label>
        <input  className=" ms-5" type="checkbox" id="sub" {...register("subscribe")} />
      </div>

      {getValues("subscribe") && (
        <div>
          <label  className="block font-medium mb-1">Referral Source</label>
          <input  className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-400"
            {...register("referral", {
              required: "Referral source is required if subscribing",
            })}
            placeholder="How did you hear about us?"
          />
          {errors.referral && (
            <p className="text-red-500 text-sm">{errors.referral.message}</p>
          )}
        </div>
      )}

      {errors.root && <p style={{ color: "red" }}>{errors.root.message}</p>}

      <button type="submit" disabled={isSubmitting} className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2">
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </form>
    </div>
  );
};

export default ReactHookForm;