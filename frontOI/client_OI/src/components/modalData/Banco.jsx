export default function Banco() {
    return(
    <div className="w-full h-full grid grid-cols-2 mb-10">
        <div className="w-full h-full space-y-5 flex flex-col justify-start items-left">
            <p className="h-1/3 font-semibold">No. Banco</p>
            <p className="h-1/3 font-semibold">Capacidad de medidores</p>
            <p className="h-1/3 font-semibold">Certificados vigentes</p>
        </div>
        <div className="w-full h-full space-y-2 flex flex-col justify-end">
            <p className="text-right h-1/3">Daniel recuerda que debes agregar los datos de los medidores en la prueba</p>
            <p className="text-right h-1/3">15</p>
            <p className="text-right h-1/3">CONFORME</p>
        </div>
    </div>
    )
}