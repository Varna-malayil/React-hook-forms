import React from "react";
import {
  useForm,
  Controller,
  useFieldArray,
  type SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import simulatedApi from "../api/index";

const formSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  email: z.string().email("Invalid email address"),
  age: z.number().min(18, "You must be at least 18 years old"),
  gender: z.enum(["male", "female", "other"], {
    message: "Gender is required",
  }),
  address: z.object({
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
  }),
  hobbies: z
    .array(
      z.object({
        name: z.string().min(1, "Hobby name is required"),
      })
    )
    .min(1, "At least one hobby is required"),
  startDate: z.date(),
  subscribe: z.boolean(),
  referral: z.string().default(""),
});

type FormData = z.infer<typeof formSchema>;

const ReactHookFormWithZod: React.FC = () => {
  const {
    control,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      age: 18,
      gender: undefined,
      address: { city: "", state: "" },
      hobbies: [{ name: "" }],
      startDate: new Date(),
      subscribe: false,
      referral: "",
    },
    resolver: zodResolver(formSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "hobbies",
  });

  const subscribe = watch("subscribe");

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const response = await simulatedApi(data);
      console.log("Success:", response);
    } catch (error: any) {
      setError("root", {
        type: "manual",
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
        <h2 className="text-2xl font-bold text-center">Registration Form</h2>

        {/* First Name */}
        <Controller
          name="firstName"
          control={control}
          render={({ field }) => (
            <div>
              <label className="block font-medium mb-1">First Name</label>
              <input {...field} className="w-full border rounded-md p-2" />
              {errors.firstName && (
                <p className="text-red-500 text-sm">
                  {errors.firstName.message}
                </p>
              )}
            </div>
          )}
        />

        {/* Last Name */}
        <Controller
          name="lastName"
          control={control}
          render={({ field }) => (
            <div>
              <label className="block font-medium mb-1">Last Name</label>
              <input {...field} className="w-full border rounded-md p-2" />
              {errors.lastName && (
                <p className="text-red-500 text-sm">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          )}
        />

        {/* Email */}
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <div>
              <label className="block font-medium mb-1">Email</label>
              <input {...field} className="w-full border rounded-md p-2" />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
          )}
        />

        {/* Age */}
        <Controller
          name="age"
          control={control}
          render={({ field }) => (
            <div>
              <label className="block font-medium mb-1">Age</label>
              <input
                type="number"
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
                className="w-full border rounded-md p-2"
              />
              {errors.age && (
                <p className="text-red-500 text-sm">{errors.age.message}</p>
              )}
            </div>
          )}
        />

        {/* Gender */}
        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <div>
              <label className="block font-medium mb-1">Gender</label>
              <select {...field} className="w-full border rounded-md p-2">
                <option value="">Select...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-sm">{errors.gender.message}</p>
              )}
            </div>
          )}
        />

        {/* Address */}
        <div>
          <label className="block font-medium mb-2">Address</label>

          <Controller
            name="address.city"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                placeholder="City"
                className="border rounded-md p-2 w-full mb-2"
              />
            )}
          />

          <Controller
            name="address.state"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                placeholder="State"
                className="border rounded-md p-2 w-full"
              />
            )}
          />

          {errors.address?.city && (
            <p className="text-red-500 text-sm">{errors.address.city.message}</p>
          )}
          {errors.address?.state && (
            <p className="text-red-500 text-sm">
              {errors.address.state.message}
            </p>
          )}
        </div>

        {/* Hobbies */}
        <div>
          <label className="block font-medium mb-2">Hobbies</label>

          {fields.map((item, index) => (
            <div key={item.id} className="flex gap-2 mb-2">
              <Controller
                name={`hobbies.${index}.name`}
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    placeholder="Hobby Name"
                    className="border rounded-md p-2 flex-1"
                  />
                )}
              />

              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="bg-red-500 text-white px-3 rounded-md"
                >
                  X
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={() => append({ name: "" })}
            className="bg-green-500 text-white px-4 py-2 rounded-md mt-2"
          >
            Add Hobby
          </button>
        </div>

        {/* Subscribe */}
        <Controller
          name="subscribe"
          control={control}
          render={({ field }) => (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
              />
              <label>Subscribe to Newsletter</label>
            </div>
          )}
        />

        {/* Referral */}
        {subscribe && (
          <Controller
            name="referral"
            control={control}
            render={({ field }) => (
              <div>
                <label className="block font-medium mb-1">
                  Referral Source
                </label>
                <input
                  {...field}
                  placeholder="How did you hear about us?"
                  className="w-full border rounded-md p-2"
                />
              </div>
            )}
          />
        )}

        {/* Root Error */}
        {errors.root && (
          <p className="text-red-600 text-center">{errors.root.message}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 rounded-md"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default ReactHookFormWithZod;