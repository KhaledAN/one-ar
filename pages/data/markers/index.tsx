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
import { Add, Delete, Upload } from "@mui/icons-material";
import MarkersEndpoints from "api/markers";
import LoadingIndicator from "components/CustomComponents/LoadingIndicator";
import { useRequester } from "hooks/useRequester";
import { NextPage } from "next";
import { useEffect, useMemo, useState } from "react";
import { requester } from "api/common";
import { serialize } from "object-to-formdata";
import Wrapper from "components/Layout/Wrapper";
import { useARActions } from "providers/ARProvider";
const MarkersPage: NextPage = () => {
  const { data, loading, reload } = useRequester<any>({
    request: MarkersEndpoints.get,
  });
  const [open, setOpen] = useState(false);

  if (loading) {
    return <LoadingIndicator />;
  }
  const { markers } = data;
  return (
    <Wrapper
      title="Markers"
      action={
        <IconButton onClick={() => setOpen(true)}>
          <Add />
        </IconButton>
      }
    >
      <CardContent>
        {markers?.length == 0 ? (
          <Typography>No markers yet</Typography>
        ) : (
          <Stack gap={2}>
            {markers?.map((marker: any) => (
              <MarkerCard marker={marker} reload={reload} />
            ))}
          </Stack>
        )}
      </CardContent>
      {open && <AddMarkerDialog open={open} setOpen={setOpen} reload={reload} />}{" "}
    </Wrapper>
  );
};

export default MarkersPage;

const AddMarkerDialog: React.FC<any> = ({ open, setOpen, reload }) => {
  const handleClose = () => setOpen(false);
  const [state, setState] = useState<{ name: string; file: File | null }>({
    name: "No Name",
    file: null,
  });
  const [loading, setLoading] = useState(false);
  const handleSave = async () => {
    setLoading(true);
    await requester(MarkersEndpoints.create, { data: serialize(state) });
    setLoading(false);
    handleClose();
    reload();
  };
  useEffect(() => {
    return setState({
      name: "No Name",
      file: null,
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
            id={"markerImage"}
            type="file"
            onChange={(e: any) => {
              setState({ ...state, file: e.target.files[0] });
            }}
          />
          <TextField
            label="Image"
            value={state.file?.name ?? "NO FILE"}
            hiddenLabel
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <label htmlFor={"markerImage"}>
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

const DeleteDialog: React.FC<any> = ({ open, setOpen, marker, reload }) => {
  const handleClose = () => setOpen(false);
  const [loading, setLoading] = useState(false);
  const handleDelete = async () => {
    setLoading(true);
    await requester(MarkersEndpoints.delete, {
      params: { id: marker._id },
    });
    setLoading(false);
    handleClose();
    reload();
  };
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>
        <Typography>Delete Marker {marker.name}</Typography>
      </DialogTitle>
      <DialogActions>
        <Button variant="contained" color="error" onClick={handleDelete} disabled={loading}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const MarkerCard: React.FC<any> = ({ marker, reload }) => {
  const [open, setOpen] = useState(false);
  const { getResourceLocalUrl } = useARActions();
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    getResourceLocalUrl(marker.imagePath).then((url) => {
      setImageUrl(url);
    });
  }, []);
  return (
    <Card>
      <CardHeader
        title={marker.name}
        action={
          <IconButton color="error" onClick={() => setOpen(true)}>
            <Delete />
          </IconButton>
        }
      />
      <CardContent>
        <img src={imageUrl} style={{ objectFit: "cover", maxWidth: "100%" }} />
      </CardContent>
      <DeleteDialog open={open} setOpen={setOpen} marker={marker} reload={reload} />
    </Card>
  );
};
