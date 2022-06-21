import { Home } from "@mui/icons-material";
import { Card, CardHeader, IconButton, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";

const Wrapper: React.FC<any> = ({
  children,
  title,
  action = (
    <IconButton sx={{ color: "#fff", visibility: "hidden" }}>
      <Home />
    </IconButton>
  ),
}) => {
  const router = useRouter();
  return (
    <Card sx={{ width: "100%", minHeight: 400, overflow: "scroll" }}>
      <CardHeader
        sx={{ backgroundColor: "secondary.light", color: "#fff" }}
        title={
          <Stack direction={"row"} alignItems="center" justifyContent={"space-between"}>
            {router.asPath != "/" && (
              <Link href={"/"}>
                <IconButton sx={{ color: "#fff" }}>
                  <Home />
                </IconButton>
              </Link>
            )}
            <Typography>{title}</Typography>
            {action}
          </Stack>
        }
      />
      {children}
    </Card>
  );
};
export default Wrapper;
