import React, { useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { EllipsisVerticalIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import AddTaskModal from './AddTaskModal';

const DropdownMenu = ({ taskId, handleDelete, projectId, setRenderChange }) => {
    const [isEditTaskModalOpen, setEditTaskModal] = useState(false);

    const refreshData = () => {
        setRenderChange(true);
    };

    const handleSetEditModal = (e) => {
        e.stopPropagation();
        setEditTaskModal(true);
    };

    return (
        <>
            <Menu as="div" className="relative inline-block text-left">
                <Menu.Button 
                    className="rounded-md p-1 text-slate-500 hover:bg-slate-200 focus:outline-none focus:ring focus:ring-indigo-200"
                >
                    <EllipsisVerticalIcon className="h-5 w-5" />
                </Menu.Button>
                
                <Transition
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items className="absolute left-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        onClick={handleSetEditModal}
                                        className={`${
                                            active ? 'bg-indigo-500 text-white' : 'text-slate-500'
                                        } flex w-full items-center px-3 py-2 text-sm`}
                                    >
                                        <PencilSquareIcon className="mr-2 h-4 w-4" />
                                        Edit
                                    </button>
                                )}
                            </Menu.Item>
                            
                            <div className="border-t border-gray-100">
                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            onClick={(e) => handleDelete(e, taskId)}
                                            className={`${
                                                active ? 'bg-red-500 text-white' : 'text-slate-500'
                                            } flex w-full items-center px-3 py-2 text-sm`}
                                        >
                                            <TrashIcon className="mr-2 h-4 w-4" />
                                            Delete
                                        </button>
                                    )}
                                </Menu.Item>
                            </div>
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
            
            <AddTaskModal 
                isAddTaskModalOpen={isEditTaskModalOpen} 
                setAddTaskModal={setEditTaskModal} 
                projectId={projectId} 
                taskId={taskId} 
                edit={true} 
                refreshData={refreshData} 
            />
        </>
    );
};

export default DropdownMenu;