export default function Banco({ nBanco, capacidad, marca, modelo, habilitado, cert }) {
    return (
        <div className="w-full h-full grid grid-cols-2 gap-4 mb-10">
            {nBanco && (
                <>
                    <p className="font-semibold">No. Banco</p>
                    <p className="text-right">{nBanco}</p>
                </>
            )}
            {capacidad && (
                <>
                    <p className="font-semibold">Capacidad de medidores</p>
                    <p className="text-right">{capacidad}</p>
                </>
            )}
            {marca && (
                <>
                    <p className="font-semibold">Marca</p>
                    <p className="text-right">{marca}</p>
                </>
            )}
            {modelo && (
                <>
                    <p className="font-semibold">Modelo</p>
                    <p className="text-right">{modelo}</p>
                </>
            )}
            {habilitado && (
                <>
                    <p className="font-semibold">Mantenimiento</p>
                    <p className="text-right">{habilitado}</p>
                </>
            )}
            {cert && (
                <>
                    <p className="font-semibold">Certificados vigentes</p>
                    <p className="text-right">{cert}</p>
                </>
            )}
        </div>
    );
}
