import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Facebook, Github, Linkedin } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Footer() {
   return (
      <footer className="bg-sky-500 py-16">
         <div className="max-w-7xl mx-auto px-6">
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border-2 border-slate-800/10 p-8 md:p-12 shadow-lg">
               <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                  {/* Left block: logo + description + CTA */}
                  <div className="md:col-span-2 flex flex-col justify-between">
                     <div>
                        <div className="flex items-center gap-4">
                           <img
                              src="/tutor.png"
                              alt="TutorMatch"
                              className="h-12 w-12 object-contain"
                           />
                           <h3 className="text-2xl font-semibold text-slate-800 dark:text-white">
                              TutorMatch
                           </h3>
                        </div>

                        <p className="mt-6 text-slate-600 dark:text-slate-300 max-w-md">
                           Phần mềm toàn diện nhất dành cho các công ty dạy kèm
                           — lập lịch, quản lý khách hàng, thanh toán và nhiều
                           hơn nữa.
                        </p>
                     </div>

                     <div className="mt-6">
                        <Button className="bg-violet-700 hover:bg-violet-800 text-white px-4 py-2 rounded-full">
                           Đặt lịch dạy
                        </Button>
                     </div>
                  </div>

                  {/* Links columns */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:col-span-3">
                     <div>
                        <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
                           Giải pháp
                        </h4>
                        <ul className="space-y-3 text-slate-600 dark:text-slate-300">
                           <li>
                              <Link to="#" className="hover:underline">
                                 Cho các gia sư
                              </Link>
                           </li>
                           <li>
                              <Link to="#" className="hover:underline">
                                 Cho học sinh, sinh viên
                              </Link>
                           </li>
                        </ul>
                     </div>

                     <div>
                        <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
                           Tính năng
                        </h4>
                        <ul className="space-y-3 text-slate-600 dark:text-slate-300">
                           <li>
                              <Link to="#" className="hover:underline">
                                 Gia sư, học sinh, sinh viên và phụ huynh
                              </Link>
                           </li>
                           <li>
                              <Link to="#" className="hover:underline">
                                 Thanh toán
                              </Link>
                           </li>
                           <li>
                              <Link to="#" className="hover:underline">
                                 Quản lý lịch học
                              </Link>
                           </li>
                           <li>
                              <Link to="#" className="hover:underline">
                                 Tuỳ chỉnh nâng cao
                              </Link>
                           </li>
                        </ul>
                     </div>

                     <div>
                        <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
                           About us
                        </h4>
                        <ul className="space-y-3 text-slate-600 dark:text-slate-300">
                           <li>
                              <Link to="#" className="hover:underline">
                                 About
                              </Link>
                           </li>
                           <li>
                              <Link to="#" className="hover:underline">
                                 Blog
                              </Link>
                           </li>
                           <li>
                              <Link to="#" className="hover:underline">
                                 Reviews
                              </Link>
                           </li>
                           <li>
                              <Link to="#" className="hover:underline">
                                 Careers
                              </Link>
                           </li>
                        </ul>
                     </div>

                     <div>
                        <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
                           Support
                        </h4>
                        <ul className="space-y-3 text-slate-600 dark:text-slate-300">
                           <li>
                              <Link to="#" className="hover:underline">
                                 Contact
                              </Link>
                           </li>
                           <li>
                              <Link to="#" className="hover:underline">
                                 Change log
                              </Link>
                           </li>
                           <li>
                              <Link to="#" className="hover:underline">
                                 Help centre
                              </Link>
                           </li>
                        </ul>
                     </div>
                  </div>
               </div>

               {/* Divider */}
               <div className="border-t border-slate-200 dark:border-slate-800 mt-8 pt-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                     <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600 dark:text-slate-300">
                        <Link to="#" className="hover:underline">
                           API Documentation
                        </Link>
                        <Link to="#" className="hover:underline">
                           Terms &amp; Conditions
                        </Link>
                        <Link to="#" className="hover:underline">
                           Privacy
                        </Link>
                        <Link to="#" className="hover:underline">
                           Sitemap
                        </Link>
                     </div>

                     <div className="flex items-center gap-3">
                        <button
                           aria-label="facebook"
                           className={cn(
                              "p-3 rounded-lg bg-slate-100 dark:bg-slate-800",
                              "hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                           )}
                        >
                           <Facebook className="h-4 w-4 text-sky-700" />
                        </button>
                        <button
                           aria-label="github"
                           className={cn(
                              "p-3 rounded-lg bg-slate-100 dark:bg-slate-800",
                              "hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                           )}
                        >
                           <Github className="h-4 w-4 text-sky-700" />
                        </button>
                        <button
                           aria-label="linkedin"
                           className={cn(
                              "p-3 rounded-lg bg-slate-100 dark:bg-slate-800",
                              "hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                           )}
                        >
                           <Linkedin className="h-4 w-4 text-sky-700" />
                        </button>
                     </div>
                  </div>

                  <p className="mt-6 text-center text-sm text-slate-700 dark:text-slate-300">
                     © All rights reserved 2025. TutorMatch™
                  </p>
               </div>
            </div>
         </div>
      </footer>
   );
}
