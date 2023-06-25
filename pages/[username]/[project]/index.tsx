import { ContributionGraph } from "@/components/GH";
import { axios } from "@/configs/axios";
import DashboardLayout from "@/layouts/DashboardLayout";
import { useFlyStore } from "@/stores/flyStore";
import { useEffect, useState } from "react";
import fileSize from "file-size";

const Project = () => {
  const { fly } = useFlyStore();

  const [overview, setOverview] = useState({
    files: 0,
    used_storage: 0,
  });

  const [uploads, setUploads] = useState([]);

  const fetchOverview = async () => {
    try {
      const res = await axios(`/fly/overview?fly_id=${fly.uuid}`);
      setOverview(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUploads = async () => {
    try {
      const res = await axios(`/analytics?fly_id=${fly.uuid}`);
      setUploads(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (fly?.uuid) {
      fetchUploads();
      fetchOverview();
    }
  }, [fly?.uuid]);

  return (
    <DashboardLayout>
      <div className="flex gap-5">
        <div className="border border-gray-700 p-5 rounded-md w-1/2">
          <h1 className="text-2xl font-semibold">Total files</h1>
          <p className="text-4xl mt-3">{overview.files}</p>
        </div>
        <div className="border border-gray-700 p-5 rounded-md w-1/2">
          <h1 className="text-2xl font-semibold">Used storage</h1>
          <p className="text-4xl mt-3">
            {fileSize(overview.used_storage).to(
              Number(fileSize(overview.used_storage).to("MB")) > 999
                ? "GB"
                : "MB"
            )}{" "}
            {Number(fileSize(overview.used_storage).to("MB")) > 999
              ? "GB"
              : "MB"}
          </p>
        </div>
      </div>
      <div className="border border-gray-700 p-5 rounded-md mt-5">
        <h1 className="text-2xl font-semibold">Upload streak</h1>
        <p className="my-3 font-semibold">{overview.files} uploads in 2023</p>
        <ContributionGraph contributionData={uploads} />
      </div>
    </DashboardLayout>
  );
};

export default Project;
