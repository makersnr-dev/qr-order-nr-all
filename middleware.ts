import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: ['/((?!_next|api|favicon.ico).*)'],
};

const DEV_BYPASS = process.env.NODE_ENV === 'development';

function orderGuard(pathname: string){
  // Matches /{storeSlug}/order or deeper
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length >= 2 && parts[1] === 'order') return true;
  return false;
}

export async function middleware(req: NextRequest){
  const { pathname, searchParams } = { pathname: req.nextUrl.pathname, searchParams: req.nextUrl.searchParams };
  if (orderGuard(pathname)){
    if (DEV_BYPASS){
      return NextResponse.next();
    }
    const token = searchParams.get('token');
    if (!token){
      // redirect to info page
      const storeSlug = pathname.split('/').filter(Boolean)[0];
      const url = req.nextUrl.clone();
      url.pathname = `/stores/${storeSlug}`;
      url.search = '';
      return NextResponse.redirect(url);
    }
    // Perform cheap verification at edge by passing to API for full check? For now allow and let page validate client-side as sample.
    // Keeping edge light. In production, we could implement full verify with WebCrypto here.
    return NextResponse.next();
  }
  return NextResponse.next();
}
