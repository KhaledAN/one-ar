import { CardContent, Link as MUILink, Stack, Typography } from "@mui/material";
import ModelSelection from "components/Fragments/ModelSelection";
import Wrapper from "components/Layout/Wrapper";
import { NextPage } from "next";
import Link from "next/link";

const HomePage: NextPage = () => {
  return (
    <Wrapper title="Navigation">
      <CardContent>
        <Stack gap={2}>
          <Link href={"/data/markers"}>
            <MUILink>
              <Typography>Markers</Typography>
            </MUILink>
          </Link>
          <Link href={"/data/models"}>
            <MUILink>
              <Typography>3D Models</Typography>
            </MUILink>
          </Link>
          <Link href={"/ar"}>
            <MUILink>
              <Typography>AR</Typography>
            </MUILink>
          </Link>
        </Stack>
      </CardContent>
    </Wrapper>
  );
};

export default HomePage;
