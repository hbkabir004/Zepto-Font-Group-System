import React from 'react';

const SmallTable = () => {
    return (
        <div className="flex flex-col">
            <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                    <div className="overflow-hidden">
                        <table
                            className="min-w-full text-center text-sm font-light text-surface dark:text-white">
                            <thead
                                className="border-b border-neutral-200 font-medium dark:border-white/10">
                                <tr>
                                    <th scope="col" className="px-6 py-2">#</th>
                                    <th scope="col" className="px-6 py-2">First</th>
                                    <th scope="col" className="px-6 py-2">Last</th>
                                    <th scope="col" className="px-6 py-2">Handle</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-neutral-200 dark:border-white/10">
                                    <td className="whitespace-nowrap px-6 py-2 font-medium">1</td>
                                    <td className="whitespace-nowrap px-6 py-2">Mark</td>
                                    <td className="whitespace-nowrap px-6 py-2">Otto</td>
                                    <td className="whitespace-nowrap px-6 py-2">@mdo</td>
                                </tr>
                                <tr className="border-b border-neutral-200 dark:border-white/10">
                                    <td className="whitespace-nowrap px-6 py-2 font-medium">2</td>
                                    <td className="whitespace-nowrap px-6 py-2 ">Jacob</td>
                                    <td className="whitespace-nowrap px-6 py-2">Thornton</td>
                                    <td className="whitespace-nowrap px-6 py-2">@fat</td>
                                </tr>
                                <tr className="border-b border-neutral-200 dark:border-white/10">
                                    <td className="whitespace-nowrap px-6 py-2 font-medium">3</td>
                                    <td colspan="2" className="whitespace-nowrap px-6 py-2">
                                        Larry the Bird
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-2">@twitter</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SmallTable;