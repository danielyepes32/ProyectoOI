import { Button } from "@nextui-org/react"

export default function VariationBar({
    validateDPIvar,
    validateDPOvar,
    validateFlowvar,
    validateTempvar,
    maxDPIvar,
    maxDPOvar,
    maxFlowvar,
    maxTemp
}){
    return(
        <div className="w-full border shadow-lg flex h-auto rounded-[25px] bg-white p-2">
        <div className="w-1/4 flex-col justify-center place-items-center">
          <div className="flex-col justify-center place-items-center space-y-2">
            <div className="w-full h-auto flex flex-col leading-none">
              <span className="text-center w-full font-inter">Var</span>
              <span className="text-center w-full font-inter"> (%) </span>
            </div>
            <Button
              className={`flex justify-center ${validateDPIvar ? 'bg-custom-blue' : "bg-red-100"}`}
              isIconOnly
              disabled
              >
            <span className="text-white text-center">{maxDPIvar}</span>
            </Button>
          </div>
        </div>
        <div className="w-1/4 flex-col justify-center place-items-center space-y-2">
          <div className="w-full h-auto flex flex-col leading-none">
            <span className="text-center w-full font-inter">Var</span>
            <span className="text-center w-full font-inter"> (%) </span>
          </div>
          <Button
            className={`flex justify-center ${validateDPOvar ? 'bg-custom-blue' : "bg-red-100"}`}
            isIconOnly
            disabled
            >
            <span className="text-white text-center">{maxDPOvar}</span>
          </Button>
        </div>
        <div className="w-1/4 flex-col justify-center place-items-center space-y-2">
          <div className="w-full h-auto flex flex-col leading-none">
            <span className="text-center w-full font-inter">Var</span>
            <span className="text-center w-full font-inter"> (%) </span>
          </div>
          <Button
            className={`flex justify-center ${validateFlowvar ? 'bg-custom-blue' : "bg-red-100"}`}
            isIconOnly
            disabled
          >
           <span className="text-white text-center">{maxFlowvar}</span>
          </Button>
        </div>
        <div className="w-1/3 justify-center place-items-center space-y-2">
          <div className="w-full h-auto flex flex-col leading-none">
            <span className="text-center w-full font-inter">Var</span>
            <span className="text-center w-full font-inter"> (%) </span>
          </div>
          <Button
            className={`flex justify-center ${validateTempvar ? 'bg-custom-blue' : "bg-red-100"}`}
            isIconOnly
            disabled
          >
            <span className="text-white text-center">{maxTemp}</span>
          </Button>
        </div>
      </div>
    )
}