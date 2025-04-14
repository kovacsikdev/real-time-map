import { useContext, useEffect, useState, useRef } from "react";
import { VehicleDataContext } from "../helpers/context";
import { VehicleDataType } from "../helpers/types";
import { realTimeVideoMap } from "../helpers/helpers";
import InfoIcon from "/info-icon.svg";
import { InfoBoxType } from "../helpers/types";
import "./VehicleVideo.css";

type VehicleVideoProps = {
  setInfoBoxType: (type: InfoBoxType) => void;
}

export const VehicleVideo = (props: VehicleVideoProps) => {
  const { setInfoBoxType } = props;
  const env = import.meta.env.NODE_ENV;
  const videoRef: any = useRef(null);
  const { vehicleData, selectedVehicleId } = useContext(VehicleDataContext);
  const [selectedVehicleData, setSelectedVehicleData] = useState<any>({});
  const [vehicleVideoSrc, setVehicleVideoSrc] = useState("");

  useEffect(() => {
    if (selectedVehicleId) {
      const selectedVehicle = vehicleData.find(
        (item: VehicleDataType) => item.id === selectedVehicleId
      );
      setSelectedVehicleData(selectedVehicle || {});
    } else {
      setSelectedVehicleData({});
    }
  }, [vehicleData, selectedVehicleId]);

  useEffect(() => {
    if (selectedVehicleData.id) {
      const url =
        env === "development"
          ? "/realtime_videos/"
          : "https://github.com/kovacsikdev/real-time-map/raw/refs/heads/main/assets/realtime_videos/";
      const video = realTimeVideoMap(selectedVehicleData.id);
      if (selectedVehicleData?.health?.overall === "good") {
        setVehicleVideoSrc(`${url}driving_${video?.driving || "1"}`);
      } else {
        setVehicleVideoSrc(`${url}stopped_${video?.stopped || "1"}`);
      }
    } else {
      setVehicleVideoSrc("");
    }
  }, [selectedVehicleData, vehicleVideoSrc]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [vehicleVideoSrc]);

  return (
    <div
      className={`vehicle-video ${
        selectedVehicleData.id ? "vehicle-video-visible" : ""
      }`}
    >
      {vehicleVideoSrc && (
        <>
          <div className="vehicle-video-info">
            <button
              id="btn-info-box-locations"
              onClick={() => {
                setInfoBoxType("video");
              }}
            >
              <img src={InfoIcon} alt="information icon" />
            </button>
          </div>
          <div className="loading-spinner"></div>
          <video ref={videoRef} autoPlay loop muted playsInline>
            <source src={`${vehicleVideoSrc}.mp4`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </>
      )}
      {!vehicleVideoSrc && (
        <div>Select a vehicle to view vehicle video feed</div>
      )}
    </div>
  );
};
