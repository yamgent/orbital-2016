class CreateTutorials < ActiveRecord::Migration
  def change
    create_table :tutorials do |t|
      t.integer :day

      t.time :start_time
      t.time :end_time

      t.timestamps null: false
    end
  end
end
