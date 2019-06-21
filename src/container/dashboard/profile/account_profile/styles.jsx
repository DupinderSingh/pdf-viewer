export default theme => ({
  root: {},
  details: {
    display: 'block'
  },
  info: {},
  locationText: {
    marginTop: theme.spacing.unit,
    color: theme.palette.text.secondary
  },
  dateText: {
    color: theme.palette.text.secondary
  },
  avatar: {
    margin: '0 auto',
    height: '110px',
    width: '110px',
    position: 'relative'
  },
  progressWrapper: {
    marginTop: theme.spacing.unit * 2,
    width: '100%'
  },
  uploadButton: {
    marginRight: theme.spacing.unit * 2
  }
});
