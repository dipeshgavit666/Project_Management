import React, { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import axios from "axios";
import { toast } from 'react-hot-toast';
import { XMarkIcon } from '@heroicons/react/24/outline';

const AddProjectModal = ({ isModalOpen, closeModal, edit = false, id = null }) => {
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (edit && isModalOpen && id) {
            fetchProjectData();
        }
    }, [isModalOpen, edit, id]);

    const fetchProjectData = async () => {
        try {
            const res = await axios.get(`http://localhost:9000/project/${id}`);
            setTitle(res.data[0].title);
            setDesc(res.data[0].description);
        } catch (error) {
            toast.error('Failed to fetch project data');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            let response;
            if (!edit) {
                response = await axios.post('http://localhost:9000/project/', { 
                    title, 
                    description: desc 
                });
                toast.success('Project created successfully');
            } else {
                response = await axios.put(`http://localhost:9000/project/${id}`, { 
                    title, 
                    description: desc 
                });
                toast.success('Project updated successfully');
            }
            
            // Dispatch custom event for project update
            const customEvent = new CustomEvent('projectUpdate', { 
                detail: { ...response.data } 
            });
            document.dispatchEvent(customEvent);
            
            // Reset form and close modal
            setTitle('');
            setDesc('');
            closeModal();
        } catch (error) {
            if (error.response?.status === 422) {
                toast.error(error.response.data.details[0].message);
            } else {
                toast.error('Something went wrong');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Transition appear show={isModalOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={closeModal}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-lg bg-white shadow-xl transition-all">
                                <div className="flex items-center justify-between border-b px-6 py-4">
                                    <Dialog.Title as="h3" className="text-lg font-medium text-gray-900">
                                        {edit ? 'Edit Project' : 'Create Project'}
                                    </Dialog.Title>
                                    <button
                                        onClick={closeModal}
                                        className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <XMarkIcon className="h-5 w-5" />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="p-6">
                                    <div className="mb-4">
                                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                            Title
                                        </label>
                                        <input
                                            id="title"
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            placeholder="Project title"
                                            required
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                            Description
                                        </label>
                                        <textarea
                                            id="description"
                                            value={desc}
                                            onChange={(e) => setDesc(e.target.value)}
                                            rows={6}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            placeholder="Project description"
                                        />
                                    </div>

                                    <div className="mt-6 flex justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={closeModal}
                                            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70"
                                        >
                                            {isLoading ? 'Saving...' : 'Save'}
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default React.memo(AddProjectModal);