import Link from "next/link";
import { Ticket } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm mb-6">
          <Ticket size={32} />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Sign in to UniTickets
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Exclusive for verified college students
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-900 px-4 py-8 shadow sm:rounded-2xl sm:px-10 border border-gray-100 dark:border-gray-800">
          <form className="space-y-6" action="#">
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">
                College Email Address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="student@college.edu"
                  className="block w-full rounded-xl border-0 py-2.5 px-3 bg-white dark:bg-gray-950 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-800 placeholder:text-gray-400 dark:placeholder:text-gray-550 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-full bg-gray-900 dark:bg-gray-100 px-3 py-3 text-sm font-semibold leading-6 text-white dark:text-gray-900 shadow-sm hover:bg-gray-800 dark:hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 transition-colors"
              >
                Send OTP
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-800" />
              </div>
              <div className="relative flex justify-center text-sm font-medium leading-6">
                <span className="bg-white dark:bg-gray-900 px-6 text-gray-500 dark:text-gray-400">Don't have an account?</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <a href="#" className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500">
                Sign up with College ID
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
