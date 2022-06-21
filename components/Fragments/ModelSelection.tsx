import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Card, CardContent, CardHeader, Collapse, IconButton, Stack, Typography } from "@mui/material";
import ModelsEndpoints from "api/models";
import LoadingIndicator from "components/CustomComponents/LoadingIndicator";
import { useRequester } from "hooks/useRequester";
import dynamic from "next/dynamic";
import { useARActions, useARState } from "providers/ARProvider";
import { Suspense, useState } from "react";
import { ScrollMenu } from "react-horizontal-scrolling-menu";
const ModelViewer = dynamic(() => import("./ModelViewer"), { ssr: false });

const ModelSelection: React.FC<any> = () => {
  const [open, setOpen] = useState(true);
  const { data, loading } = useRequester<any>({
    request: ModelsEndpoints.get,
  });
  const { handleSetModel } = useARActions();
  const { model: selectedModel } = useARState();
  if (loading) {
    return <LoadingIndicator />;
  }
  const { models } = data;

  return (
    <Card elevation={5} sx={{ position: "absolute", bottom: 0, left: 0, width: "100%", zIndex: 9000000 }}>
      <CardHeader title="Models" action={<IconButton onClick={() => setOpen(!open)}>{open ? <ChevronLeft /> : <ChevronRight />}</IconButton>} />
      <Collapse in={open}>
        <Suspense>
          <CardContent>
            <ScrollMenu>
              {models.map((model: any) => {
                const path = process.env.NEXT_PUBLIC_API_URL + "/" + model.path;
                return (
                  <Card
                    id={model._id}
                    onClick={() => {
                      handleSetModel(path);
                      setOpen(false);
                    }}
                    elevation={0}
                    sx={selectedModel == path ? { border: "1px black solid" } : {}}
                  >
                    <ModelViewer src={path} />
                    <Typography align="center">{model.name}</Typography>
                  </Card>
                );
              })}
            </ScrollMenu>
          </CardContent>
        </Suspense>
      </Collapse>
    </Card>
  );
};
export default ModelSelection;
