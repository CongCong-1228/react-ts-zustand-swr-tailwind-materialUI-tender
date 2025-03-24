import { Paper, Typography, Breadcrumbs, Link as MuiLink } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

interface BreadcrumbNavigationProps {
  path: string;
  title: string;
  subTitle: string;
}

export const BreadcrumbNavigation = (props: BreadcrumbNavigationProps) => {
  return (
    <Paper elevation={0} className="mb-4 self-start p-2">
      <div className="flex items-center">
        <Typography variant="body2" className="mr-2 font-medium text-gray-600">
          当前位置：
        </Typography>
        <Breadcrumbs
          separator={
            <FontAwesomeIcon
              icon={faChevronRight}
              size="xs"
              className="text-gray-500"
            />
          }
          aria-label="breadcrumb"
        >
          <MuiLink
            component={Link}
            to={props.path} // 更改为中标公告列表的实际路径
            underline="hover"
            color="inherit"
            className="cursor-pointer text-[#666] hover:text-[#c62f24]"
          >
            {props.title}
          </MuiLink>
          <Typography color="text.primary">{props.subTitle}</Typography>
        </Breadcrumbs>
      </div>
    </Paper>
  );
};
