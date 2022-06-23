import { AlignVerticalBottom, ImageSearch } from "@mui/icons-material";
import { Button, Card, CardHeader, DialogContent, FormControl, Grid, Icon, InputLabel, MenuItem, Select, Stack, Typography } from "@mui/material";
import MarkersEndpoints from "api/markers";
import ModelsEndpoints from "api/models";
import LoadingIndicator from "components/CustomComponents/LoadingIndicator";
import Wrapper from "components/Layout/Wrapper";
import { useRequester } from "hooks/useRequester";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import { useARActions, useARState } from "providers/ARProvider";
import { useState } from "react";
import PlanePage from "./plane";
const MarkerPage = dynamic(() => import("./marker"), { ssr: false });
const ARPage: NextPage = () => {
  const [selectedMethod, setSelectedMethod] = useState("");
  const { data, loading } = useRequester<any>({
    request: ModelsEndpoints.get,
  });
  if (loading) return <LoadingIndicator />;
  const { models } = data;

  let ActiveComponent = null;
  switch (selectedMethod) {
    case "markerBased":
      ActiveComponent = MarkerBased;
      break;
    case "plane":
      ActiveComponent = PlaneBased;
      break;
  }

  return (
    <Wrapper title="Augmented Reality">
      <DialogContent>
        <Stack gap={2}>
          <Card>
            <CardHeader title="Method" subheader="AR method to be used !" />
            <DialogContent>
              <Grid container spacing={2} direction="row" justifyContent={"stretch"}>
                {[
                  { label: "Plane", value: "plane", subHeader: "Place objects on a floor/surface", icon: AlignVerticalBottom },
                  { label: "Marker", value: "markerBased", subHeader: "Place objects on an image", icon: ImageSearch },
                ].map(({ icon: MethodIcon, ...method }, i) => (
                  <Grid key={i} item xs={12} sm={6} sx={{ height: "100%" }}>
                    <Card
                      onClick={() => setSelectedMethod(method.value)}
                      sx={{
                        height: "100%",
                        cursor: "pointer",
                        transition: "all .2s",
                        ...(selectedMethod === method.value
                          ? { backgroundColor: "primary.main", color: "#fff" }
                          : {
                              "&:hover": { backgroundColor: "primary.light", color: "#fff", transform: "translate(0,-2px)" },
                            }),
                      }}
                    >
                      <CardHeader
                        subheader={<Typography> {method.subHeader}</Typography>}
                        title={
                          <Stack direction={"row"} gap={2}>
                            <Icon>
                              <MethodIcon />
                            </Icon>
                            <Typography variant="h5">{method.label}</Typography>
                          </Stack>
                        }
                      />
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </DialogContent>
          </Card>
          {ActiveComponent && <ActiveComponent />}{" "}
        </Stack>
      </DialogContent>
    </Wrapper>
  );
};

export default ARPage;

const PlaneBased: React.FC<any> = ({}) => {
  return (
    <>
      <Button onClick={() => document.getElementById("ARButton")?.click()}>Start !</Button>
      <PlanePage />
    </>
  );
};
const MarkerBased: React.FC<any> = ({}) => {
  const [selectedMarker, setSelectedMarker] = useState("");
  const [loading, setLoading] = useState(false);
  const { marker } = useARState();
  const { handleSetMarker, getResourceLocalUrl } = useARActions();
  const [readyForAR, setReadyForAR] = useState(false);

  const { data, loading: getLoading } = useRequester<any>({
    request: MarkersEndpoints.get,
  });
  if (getLoading) return <LoadingIndicator />;

  const { markers } = data;
  const handleNavigate = async () => {
    setLoading(true);
    const src = await getResourceLocalUrl(markers.find((m: any) => m._id === selectedMarker)?.patternPath, true);
    handleSetMarker(src);
    setReadyForAR(true);
    setLoading(false);
  };

  return (
    <>
      <Stack gap={2} height={200}>
        <FormControl variant="standard">
          <InputLabel>Markers</InputLabel>
          <Select value={selectedMarker} onChange={(e) => setSelectedMarker(e.target.value)}>
            {markers.map((marker: any) => (
              <MenuItem key={marker._id} value={marker._id}>
                {marker.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {selectedMarker && (
          <Button onClick={handleNavigate} disabled={loading}>
            Init
          </Button>
        )}
        {readyForAR && <MarkerPage />}
      </Stack>
    </>
  );
};
