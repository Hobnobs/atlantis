(defproject server "0.1.0"
  :description "Atlantis Server"
  :url "https://github.com/olewhalehunter/atlantis"
  :license {:name "Eclipse Public License" 
            :url "http://www.eclipse.org/legal/epl-v10.html"}
  :dependencies [[org.clojure/clojure "1.5.1"]
                 [ring/ring-json "0.2.0"]
                 [http-kit "2.0.0"]
                 [ring/ring-devel "1.1.8"]
                 [compojure "1.1.5"]
                 [ring-cors "0.1.0"]]
  :main server.core)
