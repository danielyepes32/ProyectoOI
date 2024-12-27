// Este es el componente de medidores correlativos de lo que se encarga es de mostrar los medidores que son seleccionables para trabajar en los medidores correlativos

export default function Meter_c({meters}){
    return(
    <div className="mt-7">
        <div className="w-full flex flex-col rounded-[10px] border-1 h-auto bg-white shadow-sm">
        {
        meters ? meters.map((item, index) => (
            <div key={item.meter_id}> {/* Asegúrate de incluir una clave única */}
            <div className="flex justify-between items-center p-4 border-b-1 border-gray-200">
                HOLAAAAAAAAAAAAAAAAAAA
            </div>
            <div className="w-full h-[10px] rounded-tl-[60px] rounded-tr-[60px] bg-oi-bg"></div>
                <div className="w-full flex justify-left place-items-center">
                    <div className="m-3 w-[45px] h-[45px] rounded-full justify-center bg-custom-blue place-items-center flex items-center">
                        <span className="font-inter text-white text-center">{index + 1}</span>
                    </div>
                    <div className="flex-grow flex items-center place-items-center justify-center">
                        <span className="text-center">{item.meter_id}</span>
                    </div>
                </div>
            </div>
        )) : null
        }
        </div>
    </div>
    )
}