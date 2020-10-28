import Prismic from 'prismic-javascript';
import {Client} from '../../prismic-configuration';

const createClientOptions = (req = null, prismicAccessToken = null) => {
  const reqOption = req ? {req} : {};
  const accessTokenOption = prismicAccessToken ? {accessToken: prismicAccessToken} : {};
  return {
    ...reqOption,
    ...accessTokenOption,
  };
};

const linkResolver = function (doc: any) {
  if (doc.type === 'home') {
    return '/';
  }

  return '/' + doc.id;
};

const Preview = async (req: any, res: any) => {
  const {token: ref, documentId} = req.query;
  const redirectUrl = await Client(req).getPreviewResolver(ref, documentId).resolve(linkResolver, '/');

  if (!redirectUrl) {
    return res.status(401).json({message: 'Invalid token'});
  }

  res.setPreviewData({ref});
  res.writeHead(302, {Location: `${redirectUrl}`});
  res.end();
};

export default Preview;
