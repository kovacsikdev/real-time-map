import { useState } from "react";
import { APIProvider } from "@vis.gl/react-google-maps";
import { VehicleDataContext } from "./helpers/context";
import { useVehicleData } from "./helpers/customHooks";
import { InfoBoxType } from "./helpers/types";

import {
  VehicleMap,
  SelectedVehicleDetails,
  VehicleVideo,
  InfoBox,
} from "./components";
import "./App.css";

const RealTimeMap = () => {
  const { vehicleData, clientCount, socketError } = useVehicleData();
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [infoBoxType, setInfoBoxType] = useState<InfoBoxType>("");

  const env = import.meta.env.NODE_ENV;
  const apiKey =
    env === "development"
      ? import.meta.env.VITE_PUBLIC_MAP_API_KEY_DEV
      : import.meta.env.VITE_PUBLIC_MAP_API_KEY_PROD;

  return (
    <>
      {socketError && (
        <div className="socket-error">
          There was an error connecting to the server. Please refresh to try
          again
        </div>
      )}
      <VehicleDataContext.Provider
        value={{
          vehicleData,
          selectedVehicleId,
        }}
      >
        <div className="map-wrapper">
          <div className="map-tile">
            {infoBoxType && (
              <InfoBox
                type={infoBoxType}
                hideInfoBox={() => setInfoBoxType("")}
                clientCount={clientCount}
              />
            )}
            <SelectedVehicleDetails setInfoBoxType={setInfoBoxType} />
            <VehicleVideo setInfoBoxType={setInfoBoxType} />
            <APIProvider apiKey={apiKey || ""} libraries={["marker"]}>
              <VehicleMap setSelectedVehicleId={setSelectedVehicleId} />
            </APIProvider>
          </div>
        </div>
      </VehicleDataContext.Provider>
    </>
  );
};

export default RealTimeMap;
