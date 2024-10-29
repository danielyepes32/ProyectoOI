export default function Instruments(){
    return(
    <div className="w-full h-full grid grid-cols-5 mb-10">
        <div className="col-span-2 w-full h-full space-y-5 flex flex-col justify-start items-left">
            <p className="h-1/3 font-semibold">Manómetro</p>
            <p className="h-1/3 font-semibold">Cronómetro</p>
            <p className="h-1/3 font-semibold">Termostato</p>
        </div>
        <div className="col-span-3 w-full h-full space-y-2 flex flex-col justify-end">
            <p className="text-left h-1/3">Vigencia (De: 2023-04-27, hasta 2024-04-27)</p>
            <p className="text-left h-1/3">Vigencia (De: 2023-01-15, hasta 2027-01-15)</p>
            <p className="justify-start h-1/3 flex place-items-center align-right">Vigencia (De: 2023-05-30, hasta 2024-05-30)</p>
        </div>
    </div>
    )
}