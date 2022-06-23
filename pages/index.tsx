import { Category, ImageSearch, ViewInAr } from "@mui/icons-material";
import { CardContent, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import Wrapper from "components/Layout/Wrapper";
import { NextPage } from "next";
import { useRouter } from "next/router";

const HomePage: NextPage = () => {
  const links = [
    { Icon: ImageSearch, label: "Markers", url: "/data/markers" },
    { Icon: Category, label: "3D Models", url: "/data/models" },
    { Icon: ViewInAr, label: "Start AR", url: "/ar" },
  ];
  const router = useRouter();
  return (
    <Wrapper title="Navigation">
      <CardContent>
        <List>
          {links.map(({ Icon, label, url }) => (
            <ListItemButton onClick={() => router.push(url)}>
              <ListItemIcon>{<Icon />}</ListItemIcon>
              <ListItemText primary={label} />
            </ListItemButton>
          ))}
        </List>
      </CardContent>
    </Wrapper>
  );
};

export default HomePage;
