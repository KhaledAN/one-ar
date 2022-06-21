import { Add, Delete, Upload } from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { requester } from "api/common";
import ModelsEndpoints from "api/models";
import LoadingIndicator from "components/CustomComponents/LoadingIndicator";
import Wrapper from "components/Layout/Wrapper";
import { useRequester } from "hooks/useRequester";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import { serialize } from "object-to-formdata";
import { useEffect, useState } from "react";

const ModelViewer = dynamic(() => import("components/Fragments/ModelViewer"), { ssr: false });

const ModelsPage: NextPage = () => {
  const { data, loading, reload } = useRequester<any>({
    request: ModelsEndpoints.get,
  });
  const [open, setOpen] = useState(false);

  if (loading) {
    return <LoadingIndicator />;
  }
  const { models } = data;
  return (
    <Wrapper
      title="Models"
      action={
        <IconButton onClick={() => setOpen(true)}>
          <Add />
        </IconButton>
      }
    >
      <CardContent>
        {models?.length == 0 ? (
          <Typography>No models yet</Typography>
        ) : (
          <Stack gap={2}>
            {models?.map((model: any) => (
              <ModelCard model={model} reload={reload} />
            ))}
          </Stack>
        )}
      </CardContent>
      {open && <AddModelDialog open={open} setOpen={setOpen} reload={reload} />}{" "}
    </Wrapper>
  );
};

export default ModelsPage;

const AddModelDialog: React.FC<any> = ({ open, setOpen, reload }) => {
  const handleClose = () => setOpen(false);
  const [state, setState] = useState<{ name: string; model: File | null }>({
    name: "No Name",
    model: null,
  });
  const [loading, setLoading] = useState(false);
  const handleSave = async () => {
    setLoading(true);
    await requester(ModelsEndpoints.create, { data: serialize(state) });
    setLoading(false);
    handleClose();
    reload();
  };
  useEffect(() => {
    return setState({
      name: "No Name",
      model: null,
    });
  }, []);
  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={handleClose}>
      <DialogTitle>
        <Typography>Add Marker</Typography>
      </DialogTitle>
      <DialogContent sx={{ pt: "10px !important" }}>
        <Stack gap={2}>
          <TextField
            label="Name"
            value={state.name}
            onChange={(e) => {
              setState({ ...state, name: e.target.value });
            }}
          />
          <input
            style={{ display: "none" }}
            id={"model"}
            type="file"
            onChange={(e: any) => {
              setState({ ...state, model: e.target.files[0] });
            }}
          />

          <TextField
            label="Model"
            value={state.model?.name ?? "NO FILE"}
            hiddenLabel
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <label htmlFor={"model"}>
                    <IconButton component="span" color="primary">
                      <Upload />
                    </IconButton>
                  </label>
                </InputAdornment>
              ),
            }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" disabled={loading} onClick={handleSave}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const DeleteDialog: React.FC<any> = ({ open, setOpen, model, reload }) => {
  const handleClose = () => setOpen(false);
  const [loading, setLoading] = useState(false);
  const handleDelete = async () => {
    setLoading(true);
    await requester(ModelsEndpoints.delete, { params: { id: model._id } });
    setLoading(false);
    handleClose();
    reload();
  };
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>
        <Typography>Delete Marker {model.name}</Typography>
      </DialogTitle>
      <DialogActions>
        <Button variant="contained" color="error" onClick={handleDelete} disabled={loading}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const ModelCard: React.FC<any> = ({ model, reload }) => {
  const [open, setOpen] = useState(false);
  return (
    <Card>
      <CardHeader
        title={model.name}
        action={
          <IconButton color="error" onClick={() => setOpen(true)}>
            <Delete />
          </IconButton>
        }
      />
      <CardContent sx={{ display: "flex", justifyContent: "center" }}>
        <ModelViewer src={process.env.NEXT_PUBLIC_API_URL + "/" + model.path} />
      </CardContent>
      <DeleteDialog open={open} setOpen={setOpen} model={model} reload={reload} />
    </Card>
  );
};
