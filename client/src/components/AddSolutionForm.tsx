import React, { useState } from 'react';
import type { CreateSolution } from '../common/types';

type ComponentProps = {
  action: (data: CreateSolution) => Promise<void>;
};

function AddSoultionForm({ action }: ComponentProps) {
  const [formData, setFormData] = useState<CreateSolution>({
    description: '',
    solution: '',
    reason: '',
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    action(formData);
    setFormData({
      description: '',
      solution: '',
      reason: '',
    });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="flex flex-col items-center justify-start w-full">
      <h1 className="font-bold text-2xl">Add solution</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-1/2 mt-6">
        <input
          type="text"
          value={formData.description}
          name="description"
          onChange={handleChange}
          placeholder="Description"
          className="p-2 rounded-md border border-gray-300 w-full h-10 px-2"
        />
        <input
          type="text"
          value={formData.solution}
          name="solution"
          onChange={handleChange}
          placeholder="Solution"
          className="p-2 rounded-md border border-gray-300 w-full h-10 px-2"
        />
        <input
          type="text"
          value={formData.reason}
          name="reason"
          onChange={handleChange}
          placeholder="Reason"
          className="p-2 rounded-md border border-gray-300 w-full h-10 px-2"
        />
        <button
          type="submit"
          className="p-2 rounded-md bg-blue-500 text-white h-10 mt-2 cursor-pointer"
        >
          Add solution
        </button>
      </form>
    </div>
  );
}

export default AddSoultionForm;
