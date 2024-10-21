import { useState } from "react"; // Asegúrate de importar useState
import { MdDashboard } from "react-icons/md";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { PiChatTeardropTextBold } from "react-icons/pi";
import { LuPieChart } from "react-icons/lu";
import { TbSettings } from "react-icons/tb";
import { BiExit } from "react-icons/bi";

const Menu = ({ sidebar, handleSidebar }) => {
    const [selectedButton, setSelectedButton] = useState(null); // Estado para el botón seleccionado

    const handleButtonClick = (button) => {
        setSelectedButton(button); // Actualiza el botón seleccionado
    };

    return (
        <div
            className={`fixed rounded-tr-[20px] rounded-br-[20px] w-[15vw] border border-gray-200 bg-white 
            transform shadow-lg transition-all duration-400 ease-in-out ${sidebar ? 'left-0' : '-left-full'} h-screen z-[10]`}
        >
            {/* Contenido del menú */}
            <div className="w-full h-full flex flex-col">
                <div className="w-full h-auto p-3">
                    <img src="https://www.medileser.com.pe/wp-content/uploads/2022/08/logo.png" alt="" />
                </div>
                
                {/* Botones del menú */}
                {[
                    { Icon: MdDashboard, label: 'Dashboard' },
                    { Icon: RiCalendarScheduleLine, label: 'Calendar' },
                    { Icon: PiChatTeardropTextBold, label: 'Chat' },
                    { Icon: LuPieChart, label: 'Chart' },
                    { Icon: TbSettings, label: 'Settings' },
                    { Icon: BiExit, label: 'Exit' },
                ].map((item, index) => (
                    <div className="w-full h-auto p-3" key={index}>
                        <div className={`p-1 rounded-lg transition-colors duration-300 ease-in-out ${selectedButton === index ? 'bg-custom-blue' : 'bg-white'}`}>
                            <button 
                                className="w-full h-auto flex justify-center"
                                onClick={() => handleButtonClick(index)} // Cambia el botón seleccionado
                            >
                                <item.Icon className={`w-full h-auto ${selectedButton === index ? 'text-white' : 'text-gray-500'}`} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Menu;

